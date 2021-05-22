const Discord = require("discord.js");
const bkbot = require("./handler/ClientBuilder.js"); 
const client = new bkbot();
client.queue = new Map();


require("./handler/module.js")(client);
require("./handler/Event.js")(client);

client.package = require("./package.json");
client.on("warn", console.warn); 
client.on("error", console.error); 
client.login(process.env.token).catch(console.error); 
