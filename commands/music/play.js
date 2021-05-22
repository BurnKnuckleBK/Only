const { play } = require("../../include/play");
const { MessageEmbed } = require('discord.js')
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const scdl = require("soundcloud-downloader").default;
const https = require("https");
const { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID, DEFAULT_VOLUME } = require("../../until/BKUtil");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

exports.run = async (client, message, args) => {
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    const notin = new MessageEmbed()
      .setColor('#FF0000')
      .setDescription(`Not In a Voice Channel!`)
    if (!channel) return message.channel.send(notin).catch(console.error);
    const notinsame = new MessageEmbed()
      .setColor('#FF0000')
      .setDescription(`Not In The Same Channel As ${message.client.user}`)
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.channel.send(notinsame).catch(console.error);
      const playusage = new MessageEmbed()
      .setColor('#FF0000')
      .setDescription(`Usage: ${message.client.prefix}play <YouTube URL | Video Name | Soundcloud URL>`)
    if (!args.length)
      return message
        .channel.send(playusage)
        .catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    const permissionsfailedconnect = new MessageEmbed()
      .setColor('#FF0000')
      .setDescription(`Admins Should On CONNECT Permission For Me!`)
    if (!permissions.has("CONNECT"))
      return message.channel.send(permissionsfailedconnect);
    const permissionsfailedspeack = new MessageEmbed()
      .setColor('#FF0000')
      .setDescription(`Admins Should On SPEAK Permission For Me!`)
    if (!permissions.has("SPEAK"))
      return message.channel.send(permissionsfailedspeack);

    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
    const mobileScRegex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    // Start the playlist if playlist url was provided
    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return message.client.commands.get("playlist").execute(message, args);
    } else if (scdl.isValidUrl(url) && url.includes("/sets/")) {
      return message.client.commands.get("playlist").execute(message, args);
    }

    if (mobileScRegex.test(url)) {
      try {
        https.get(url, function (res) {
          if (res.statusCode == "302") {
            return message.client.commands.get("play").execute(message, [res.headers.location]);
          } else {
            const nocontent = new MessageEmbed()
              .setColor('#FF0000')
              .setDescription(`No Content Could Be Found With That URL`)
            return message.channel.send(nocontent).catch(console.error);
          }
        });
      } catch (error) {
        console.error(error);
        return message.channel.send(error.message).catch(console.error);
      }
      return message.channel.send("Following Url Redirection...!").catch(console.error);
    }

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: DEFAULT_VOLUME || 100,
      playing: true
    };

    let songInfo = null;
    let song = null;

    if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.channel.send(error.message).catch(console.error);
      }
    } else if (scRegex.test(url)) {
      try {
        const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);
        song = {
          title: trackInfo.title,
          url: trackInfo.permalink_url,
          duration: Math.ceil(trackInfo.duration / 1000)
        };
      } catch (error) {
        console.error(error);
        return message.channel.send(error.message).catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchVideos(search, 1);
        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.channel.send(error.message).catch(console.error);
      }
    }

    if (serverQueue) {
      serverQueue.songs.push(song);
      const aDDEDTO = new MessageEmbed()
        .setColor('#00FF00')
        .setDescription(`✅ **${song.title}** Has Been Added To Queue By ${message.author}`)
      return serverQueue.textChannel
        .send(aDDEDTO)
        .catch(console.error);
    }

    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      queueConstruct.connection = await channel.join();
      await queueConstruct.connection.voice.setSelfDeaf(true);
      play(queueConstruct.songs[0], message);
    } catch (error) {
      console.error(error);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return message.channel.send(`Could Not Join The Channel: ${error}`).catch(console.error);
    }
  }

exports.help = {
  name: "play",
  description: "Plays audio from YouTube or Soundcloud",
  usage: "play",
};

exports.conf = {
  aliases: [],
  cooldown: 3,
}
