const { MessageEmbed } = require('discord.js')
var cheerio = require("cheerio");
var request = require("request");
const badwords = ['xxx', 'sex', 'fuck', 'boobs', 'ass', 'bitch', 'bellend', 'penis head', 'noob', 'arse', 'butt', 'cunt', 'vagina', 'Testicles', 'Poop', 'crap', 'fucker', 'fk', 'suck', 'sucker', 'gay', 'shit', 'bullshit']
exports.run = async (client, message, args) => {
  
    text = args.join(' ')
      for (word in badwords){
          for(str of badwords){
            if(text.includes(str)) return message.reply('No Bad Search!')
      }
    }
        const embed = new MessageEmbed();
          var options = {
            url: "http://results.dogpile.com/serp?qc=images&q=" + text + '&contentfilter=high',
            method: "GET",
            headers: {
                "Accept": "text/html",
                "User-Agent": "Chrome"
            }
        };
        request(options, function(error, response, responseBody) {
            if (error) {
                // handle error
                return;
            }
            $ = cheerio.load(responseBody); 
            var links = $(".image a.link");
            var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
                if (!urls.length) {
                    // Handle no results
                    return;
                }
                embed.setTitle(`Image Search -> ${text} <-`);
                embed.setColor('RANDOM');
                embed.setImage(urls[Math.floor(Math.random() * urls.length)]);
                embed.setFooter(`© All In One Bot by BurnKnuckle!`);
                // Send result
                message.channel.send(embed);
              })
}

  exports.help = {
    name: "image",
    description: "Show a image.",
    usage: "image [name]",
    example: "+image Google"
  }
    
  exports.conf = {
    aliases: ['img'],
    cooldown: 5
  }