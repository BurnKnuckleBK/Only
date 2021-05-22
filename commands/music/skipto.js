const { canModifyQueue } = require("../../until/BKUtil");
const { MessageEmbed } = require('discord.js')
exports.run = (client, message, args) => {
    if (!args.length || isNaN(args[0]))
      return message
        .channel.send(`Usage: ${message.client.prefix}${module.exports.name} <Queue Number>`)
        .catch(console.error);

    const queue = message.client.queue.get(message.guild.id);
    const noqueues = new MessageEmbed()
      .setColor('#FF0000')
      .setDescription(`There Is No Queue.`)
    if (!queue) return message.channel.send(noqueues).catch(console.error);
    if (!canModifyQueue(message.member)) return;
    if (args[0] > queue.songs.length)
      return message.channel.send(`The Queue Is Only ${queue.songs.length} Songs Long!`).catch(console.error);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }

    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ Skipped ${args[0] - 1} Songs`).catch(console.error);
  }
exports.help = {
  name: "skipto",
  description: "Skip to the selected queue number",
  usage: "skipto",
};

exports.conf = {
  aliases: ['st'],
};
  
