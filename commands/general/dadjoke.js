
const customDiscordJokes = require('custom-discord-jokes');
exports.run = (client, message, args) => {
// To get a random dad joke
customDiscordJokes.getRandomDadJoke (function(joke) {
    message.channel.send(joke)
})
    }

exports.help = {
    name: "dadjoke",
    description: "Sends epic jokes",
    usage: "dadjoke",
    example: "dadjoke"
};

exports.conf = {
    aliases: ['dj'],
}