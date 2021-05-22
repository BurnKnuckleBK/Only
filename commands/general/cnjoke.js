
const customDiscordJokes = require('custom-discord-jokes');
exports.run = (client, message, args) => {
customDiscordJokes.getRandomCNJoke (function(joke) {
   message.channel.send(joke)
})
    }
exports.help = {
    name: "cnjoke",
    description: "Sends epic jokes",
    usage: "cnjoke",
    example: "cnjoke"
};

exports.conf = {
    aliases: ['cnj'],
}