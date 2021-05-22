exports.run = (client, message, args) => {
    message.channel.send(`📈 Average ping to API: ${Math.round(message.client.ws.ping)} ms`).catch(console.error);
  }

exports.help = {
  name: "ping",
  description: "Show the bot's average ping",
  usage: "ping",
};

exports.conf = {
  aliases: [],
  cooldown: 10,
}

