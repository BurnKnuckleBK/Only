const { MessageEmbed } = require('discord.js')
const fs = require("fs");
let config;

try {
  config = require("../../config.json");
} catch (error) {
  config = null;
}

exports.run = (client, message, args) => {
    if (!config) return;
    config.PRUNING = !config.PRUNING;

    fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.log(err);
        return message.channel.send("There Was An Error Writing To The File.").catch(console.error);
      }
      const pRUNING = new MessageEmbed()
      .setColor('#FF0000')
      .setDescription(`Message pruning is ${config.PRUNING ? "**Enabled**" : "**Disabled**"}`)
      return message.channel
        .send(pRUNING)
        .catch(console.error);
    });
  }

exports.help = {
  name: "pruning",
  description: "Toggle pruning of bot messages",
  usage: "pruning",
};

exports.conf = {
  aliases: [],
}
