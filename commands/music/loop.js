const { canModifyQueue } = require("../../until/BKUtil");
Discord = require('discord.js')
exports.run = async (client, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    const nomusic = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setDescription(`Currently No Music Is Playing!`)
    if (!queue) return message.channel.send(nomusic).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    // toggle from false to true and reverse
    queue.loop = !queue.loop;
    const loopss = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setDescription(`Loop is now ${queue.loop ? "**On**" : "**Off**"}`)
    return queue.textChannel.send(loopss).catch(console.error);
  }

exports.help = {
  name: "loop",
  description: "Toggle music loop",
  usage: "loop",
};

exports.conf = {
  aliases: ['l'],
}
