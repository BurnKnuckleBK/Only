const { canModifyQueue } = require("../../until/BKUtil");
const { MessageEmbed } = require('discord.js')
exports.run = (client, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    const nomusic = new MessageEmbed()
      .setColor('#ff0000')
      .setDescription(`Currently No Music Is Playing!`)
    if (!queue) return message.reply(nomusic).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      const pasued = new MessageEmbed()
      .setColor('#00FF00')
      .setDescription(`${message.author} ⏸ Paused!`)
      return queue.textChannel.send(pasued).catch(console.error);
    }
  }

exports.help = {
  name: "pause",
  description: "Pause the currently playing music",
  usage: "pause",
};

exports.conf = {
  aliases: ['p'],
}
