const ytdl = require("erit-ytdl");
const scdl = require("soundcloud-downloader").default;
const { canModifyQueue, STAY_TIME } = require("../until/BKUtil");
const { MessageEmbed } = require('discord.js')

module.exports = {
  async play(song, message) {
    const { SOUNDCLOUD_CLIENT_ID } = require("../until/BKUtil");

    let config;

    try {
      config = require("../config.json");
    } catch (error) {
      config = null;
    }

    const PRUNING = config ? config.PRUNING : process.env.PRUNING;

    const queue = message.client.queue.get(message.guild.id);

    if (!song) {
      setTimeout(function () {
        if (queue.connection.dispatcher && message.guild.me.voice.channel) return;
        queue.channel.leave();
        const noone = new MessageEmbed()
            .setColor('#FF0000')
            .setDescription(`There Is No One Using Me For SomeTime So I Am Leaving!`)
        queue.textChannel.send(noone);
      }, STAY_TIME * 1000);
      const ended = new MessageEmbed()
            .setColor('#FF0000')
            .setDescription(`Music Queue Ended!`)
      queue.textChannel.send(ended).then(msg => {
        msg.delete({ timeout: 3000 })
      }).catch(console.error);
      return message.client.queue.delete(message.guild.id);
    }

    let stream = null;
    let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

    try {
      if (song.url.includes("youtube.com")) {
        stream = await ytdl(song.url, { highWaterMark: 1 << 25 });
      } else if (song.url.includes("soundcloud.com")) {
        try {
          stream = await scdl.downloadFormat(song.url, scdl.FORMATS.OPUS, SOUNDCLOUD_CLIENT_ID);
        } catch (error) {
          stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, SOUNDCLOUD_CLIENT_ID);
          streamType = "unknown";
        }
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      console.error(error);
      return message.channel.send(`Error: ${error.message ? error.message : error}`);
    }

    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

    const dispatcher = queue.connection
      .play(stream, { type: streamType })
      .on("finish", () => {
        if (collector && !collector.ended) collector.stop();

        if (queue.loop) {
          // if loop is on, push the song back at the end of the queue
          // so it can repeat endlessly
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          // Recursively play the next song
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);

    try {
      const playing = new MessageEmbed()
        .setTitle(`🎶 Now Playing!`)
        .setColor('#00FF00')
        .setDescription(`**${song.title}**!`)
      var playingMessage = await queue.textChannel.send(playing);
      await playingMessage.react("⏭");
      await playingMessage.react("⏯");
      await playingMessage.react("🔇");
      await playingMessage.react("🔉");
      await playingMessage.react("🔊");
      await playingMessage.react("🔁");
      await playingMessage.react("⏹");
    } catch (error) {
      console.error(error);
    }

    const filter = (reaction, user) => user.id !== message.client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", (reaction, user) => {
      if (!queue) return;
      const member = message.guild.member(user);

      switch (reaction.emoji.name) {
        case "⏭":
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.connection.dispatcher.end();
          const skipped = new MessageEmbed()
            .setColor('#00FF00')
            .setDescription(`${user} ⏩ Skipped The Song`)
          queue.textChannel.send(skipped).then(msg => {
            msg.delete({ timeout: 3000 })
          }).catch(console.error);
          collector.stop();
          break;

        case "⏯":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.playing) {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.pause(true);
            const paused = new MessageEmbed()
            .setColor('#00FF00')
            .setDescription(`${user} ⏸ Paused The Music!`)
            queue.textChannel.send(paused).then(msg => {
              msg.delete({ timeout: 3000 })
            }).catch(console.error);
          } else {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.resume();
            const resumed = new MessageEmbed()
            .setColor('#00FF00')
            .setDescription(`${user} ▶ Resumed The Music!`)
            queue.textChannel.send(resumed).then(msg => {
              msg.delete({ timeout: 3000 })
            }).catch(console.error);
          }
          break;

        case "🔇":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.volume <= 0) {
            queue.volume = 100;
            queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
            const unmuteds = new MessageEmbed()
            .setColor('#00FF00')
            .setDescription(`${user} 🔊 UnMuted The Music!`)
            queue.textChannel.send(unmuteds).then(msg => {
              msg.delete({ timeout: 3000 })
            }).catch(console.error);
          } else {
            queue.volume = 0;
            queue.connection.dispatcher.setVolumeLogarithmic(0);
            const muteds = new MessageEmbed()
            .setColor('#00FF00')
            .setDescription(`${user} 🔇 Muted The Music!`)
            queue.textChannel.send(muteds).then(msg => {
              msg.delete({ timeout: 3000 })
            }).catch(console.error);
          }
          break;

        case "🔉":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member) || queue.volume == 0) return;
          if (queue.volume - 10 <= 0) queue.volume = 0;
          else queue.volume = queue.volume - 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          const dvolumes = new MessageEmbed()
            .setColor('#00FF00')
            .setDescription(`${user} 🔉 Decreased The Volume, The Volume Is Now ${queue.volume}%`)
          queue.textChannel
            .send(dvolumes)
            .then(msg => {
              msg.delete({ timeout: 3000 })
            })
            .catch(console.error);
          break;

        case "🔊":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member) || queue.volume == 100) return;
          if (queue.volume + 10 >= 100) queue.volume = 100;
          else queue.volume = queue.volume + 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          const ivolumed = new MessageEmbed()
            .setColor('#00FF00')
            .setDescription(`${user} 🔊 Increased The Volume, The Volume Is Now ${queue.volume}%`)
          queue.textChannel
            .send(ivolumed)
            .then(msg => {
              msg.delete({ timeout: 3000 })
            })
            .catch(console.error);
          break;

        case "🔁":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.loop = !queue.loop;
          const lopped = new MessageEmbed()
            .setColor('#00FF00')
            .setDescription(`Loop is now ${queue.loop ? "**On**" : "**Off**"}`)
          queue.textChannel.send(lopped).then(msg => {
            msg.delete({ timeout: 3000 })
          }).catch(console.error);
          break;

        case "⏹":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.songs = [];
          const stopped = new MessageEmbed()
            .setColor('#00FF00')
            .setDescription(`${user} ⏹ Stopped The Music!`)
          queue.textChannel.send(stopped).catch(console.error);
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      }
    });

    collector.on("end", () => {
      playingMessage.reactions.removeAll().catch(console.error);
      if (PRUNING && playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch(console.error);
      }
    });
  }
};
