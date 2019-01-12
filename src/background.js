const FIREFOX_DEFAULT_COOKIE_STORE = "firefox-default";
const CERTAINLY_PRIVATE_COOKIE_STORE = "certainly-private";
var privateCookieStoreId;
var settings;

async function togglePrivate(tab) {
  console.log(`Reopening tab `+tab.id+` in private mode`);
  loadSettings();

  browser.tabs.create({url: tab.url, cookieStoreId: privateCookieStoreId, active: tab.active, index: tab.index, windowId: tab.windowId}).then(() => {
    browser.tabs.remove(tab.id);
  });
}

async function loadSettings() {
  settings = await browser.storage.sync.get(["type", "url", "port", "dns"]);
}

async function setupContainer() {
  const contexts = await browser.contextualIdentities.query({name: CERTAINLY_PRIVATE_COOKIE_STORE})
  if (contexts.length > 0) {
    privateCookieStoreId =contexts[0].cookieStoreId;
  } else {
    const context = await browser.contextualIdentities.create({
      name: CERTAINLY_PRIVATE_COOKIE_STORE,
      color: "green",
      icon: "briefcase"
    });
    privateCookieStoreId = context.cookieStoreId;
  }

  console.log(`Container ready`);
}

async function handleProxyRequest(info) {
  const tab = await browser.tabs.get(info.tabId);
  // Proxy request if it's in the container
  if (tab.cookieStoreId === privateCookieStoreId) {
    console.log("Request was proxied");
    return {type: settings.type, host: settings.url, port: settings.port, proxyDNS: settings.dns} 
  } else {
    return {type: "direct"};
  }
}

(async function init() {
  await setupContainer();
  browser.proxy.onRequest.addListener(handleProxyRequest, {urls: ["<all_urls>"]});
  browser.browserAction.onClicked.addListener(togglePrivate);
})();
