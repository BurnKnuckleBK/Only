const { canModifyQueue } = require("../../until/BKUtil");
const { MessageEmbed } = require('discord.js')
exports.run = (client, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    const noqueues = new MessageEmbed()
      .setColor('#FF0000')
      .setDescription(`There Is No Queue.`)
    if (!queue) return message.channel.send(noqueues).catch(console.error);
    if (!canModifyQueue(message.member)) return;
    const removeusage = new MessageEmbed()
      .setColor('#FF0000')
      .setDescription(`Usage: ${message.client.prefix}remove <Queue Number>`)

    if (!args.length) return message.reply(removeusage);
    if (isNaN(args[0])) return message.reply(removeusage);

    const song = queue.songs.splice(args[0] - 1, 1);
    const removed = new MessageEmbed()
      .setColor('#00FF00')
      .setDescription(`${message.author} Removed **${song[0].title}** From The Queue.`)
    queue.textChannel.send(removed);
  }

  exports.help = {
    name: "remove",
    description: "Remove song from the queue.",
    usage: "remove",
  };
  
  exports.conf = {
    aliases: ['rm'],
  }