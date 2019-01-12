all:
	web-ext build -s src/ --overwrite-dest
zip:
	cd src && zip -r -FS ../tab-proxy.zip *

debug:
	web-ext --source-dir src/ run --firefox=nightly --verbose -u https://github.com -u https://amazon.com
