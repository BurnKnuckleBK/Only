const { canModifyQueue } = require("../../until/BKUtil");
const { MessageEmbed } = require('discord.js')
exports.run = (client, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    const noqueuess = new MessageEmbed()
      .setColor('#ff0000')
      .setDescription(`There Is No Queue!`)
    if (!queue) return message.channel.send(noqueuess).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);
    const shuf = new MessageEmbed()
      .setColor('#00FF00')
      .setDescription(`${message.author} 🔀 Shuffled The Queue!`)
    queue.textChannel.send(shuf).catch(console.error);
  }
  
exports.help = {
  name: "shuffle",
  description: "Shuffle The Queue",
  usage: "shuffle",
};

exports.conf = {
  aliases: [],
}
