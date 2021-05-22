const { canModifyQueue } = require("../../until/BKUtil");
const { MessageEmbed } = require('discord.js')
exports.run = async (client, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    const nomusic = new MessageEmbed()
      .setColor('#ff0000')
      .setDescription(`Currently No Music Is Playing!`)
    if (!queue) return message.channel.send(nomusic).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      const resumed = new MessageEmbed()
      .setColor('#00FF00')
      .setDescription(`▶ Resumed The Music!`)
      return queue.textChannel.send(resumed).catch(console.error);
    }
    const notpaused = new MessageEmbed()
      .setColor('#ff0000')
      .setDescription(`The Queue Is Not Paused!`)
    return message.channel.send(notpaused).catch(console.error);
  }



exports.help = {
  name: "resume",
  description: "Resume currently playing music",
  usage: "resume",
};

exports.conf = {
  aliases: ['r'],
}