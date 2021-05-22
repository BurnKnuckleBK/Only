const move = require("array-move");
const Discord = require('discord.js')
const { canModifyQueue } = require("../../until/BKUtil");

exports.run = (client, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    const noqueue = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setDescription("There Is No Queue Found!.")
    if (!queue) return message.channel.send(noqueue).catch(console.error);
    if (!canModifyQueue(message.member)) return;
    const queueusage = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setDescription(`Usage: ${message.client.prefix}move <Queue Number>`)
    if (!args.length) return message.channel.send(queueusage);
    if (isNaN(args[0]) || args[0] <= 1) return message.channel.send(queueusage);

    let song = queue.songs[args[0] - 1];
    console.log(song)

    queue.songs = move(queue.songs, args[0] - 1, args[1] == 1 ? 1 : args[1] - 1);
    const moved = new Discord.MessageEmbed()
      .setColor('#00FF00')
      .setDescription(`${message.author} 🚚 Moved **${song.title}** To ${args[1] == 1 ? 1 : args[1] - 1} In Queue.`)
    queue.textChannel.send(moved);
  }

exports.help = {
  name: "move",
  description: "Move songs around in the queue",
};

exports.conf = {
  aliases: ["mv"],
}