async function showOptions() {
  var defaultSettings = {
    "type": "socks",
    "url": "localhost",
    "port": 9050,
    "dns": true
  }

  function setCurrentChoice(result) {
    document.querySelector("#ptype").value = result.type || defaultSettings.type;
    document.querySelector("#purl").value = result.url || defaultSettings.url;
    document.querySelector("#pport").value = result.port || defaultSettings.port;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }
  var getting = browser.storage.sync.get(["type", "url", "port", "dns"]);
  getting.then(setCurrentChoice, onError);
}

function saveOptions(e) {
  e.preventDefault();
  var proxyDNS = false;
  if (document.querySelector("#ptype").value === "socksv5") {
    proxyDNS = true; // only socksv5 supports this option at the moment
  }
  browser.storage.sync.set({
    "type": document.querySelector("#ptype").value,
    "url": document.querySelector("#purl").value,
    "port": document.querySelector("#pport").value,
    "dns": proxyDNS
  });
}

document.addEventListener("DOMContentLoaded", showOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
