# HasteFS #
## Installation ##
```bash
npm install git+https://github.com/kwdev2k7/hastefs.git
```
## Usage: ##
```js
//somewhere in async function...
let hfs = new (require("@kwdev2k7/hastefs").HasteFS)({
	host: "http://localhost:7777",//Hastebin host. REQUIRED.
	base: "qiwymexe", //Url to load inital structure from. NOT REQUIRED.
	saveinterval: 60000 //interval(in ms) in which HasteFS instance automatically saves data on host. NOT REQUIRED.
});
await hfs.run();
hfs.mkdir("/home/");
//Makes directory home at root folder.
hfs.write("/home/secret.txt", "kwdev2k7 has made hastefs project for something bigger. Coming soon...");
console.log(hfs.exists("/home/"));
//Outputs true.
console.log(hfs.listdir("/home/"));
//Outputs ["secret.txt"].
console.log(hfs.cat("/home/secret.txt"));
//Outputs contents of secret.txt.
hfs.remove("/home/");
//Entirely deletes home directory.
console.log(await hfs.save());
//Logs random key on which your fs is saved.
```
