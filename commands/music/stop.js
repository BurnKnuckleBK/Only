const { canModifyQueue } = require("../../until/BKUtil");
const { MessageEmbed } = require('discord.js')
exports.run = (client, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    const nomusic = new MessageEmbed()
      .setColor('#ff0000')
      .setDescription(`Currently No Music Is Playing!`)
    if (!queue) return message.reply(nomusic).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    const stopped = new MessageEmbed()
      .setColor('#00FF00')
      .setDescription(`${message.author} ⏹ Stopped The Music!`)
    queue.textChannel.send(stopped).catch(console.error);
  }

exports.help = {
  name: "stop",
  description: "Stops the music",
  usage: "stop",
};

exports.conf = {
  aliases: [],
}
