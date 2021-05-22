const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

exports.run = async (client, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    const nomusic = new MessageEmbed()
      .setColor('#ff0000')
      .setDescription(`Currently No Music Is Playing!`)
    if (!queue) return message.channel.send(nomusic).catch(console.error);

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = `No lyrics found for ${queue.songs[0].title}.`;
    } catch (error) {
      lyrics = `No lyrics found for ${queue.songs[0].title}.`;
    }
    console.log(lyrics)

    let lyricsEmbed = new MessageEmbed()
      .setTitle(`${queue.songs[0].title} — Lyrics`)
      .setDescription(lyrics)
      .setColor("#F8AA2A")
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
  }

exports.help = {
  name: "lyrics",
  description: "Get lyrics for the currently playing song",
};

exports.conf = {
  aliases: ["ly"],
}
