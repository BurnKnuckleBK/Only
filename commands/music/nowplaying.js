const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    const nomusic = new MessageEmbed()
      .setColor('#ff0000')
      .setDescription(`Currently No Music Is Playing!`)
    if (!queue) return message.reply(nomusic).catch(console.error);

    const song = queue.songs[0];
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const left = song.duration - seek;

    let nowPlaying = new MessageEmbed()
      .setTitle("Now playing")
      .setDescription(`${song.title}\n${song.url}`)
      .setColor("#00FF00")
      .setAuthor(message.client.user.username);

    if (song.duration > 0) {
      nowPlaying.addField(
        "\u200b",
        new Date(seek * 1000).toISOString().substr(11, 8) +
          "[" +
          createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
          "]" +
          (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
        false
      );
      nowPlaying.setFooter("Time Remaining: " + new Date(left * 1000).toISOString().substr(11, 8));
    }

    return message.channel.send(nowPlaying);
  }
  exports.help = {
    name: "np",
    description: "Show now playing song",
    usage: "np",
  };
exports.conf = {
  aliases: [],
}

  