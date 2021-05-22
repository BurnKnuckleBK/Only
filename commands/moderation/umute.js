const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");
exports.run = async (client, message, args) => {
   const logChannel = message.guild.channels.cache.find(c => c.name === "logs") || message.channel;

   if (message.deletable) message.delete();

   // No args
   if (!args[0]) {
       return message.reply("Please provide a person to UnMute.").then(msg => {
           msg.delete({ timeout: 5000 })
       })
   }


   // No author permissions
   if (!message.member.hasPermission("ADMINISTRATOR")) {
       return message.reply("❌ You do not have permissions to UnMute members. Please contact a staff member").then(msg => {
           msg.delete({ timeout: 5000 })
       })
   
   }
   // No bot permissions
   if (!message.guild.me.hasPermission("ADMINISTRATOR")) {
       return message.reply("❌ I do not have permissions to UnMute members. Please contact a staff member").then(msg => {
           msg.delete({ timeout: 5000 })
       })
   }

   const tounmute = message.mentions.members.first() || message.guild.members.get(args[0]);

   // No member found
   if (!tounmute) {
       return message.reply("Couldn't find that member, try again").then(msg => {
           msg.delete({ timeout: 5000 })
       })
   }

   // Can't ban urself
   if (tounmute.id === message.author.id) {
       return message.reply("You can't UnMute yourself...").then(msg => {
           msg.delete({ timeout: 5000 })
       })
   }
   
    
    const promptEmbed = new MessageEmbed()
    .setColor("GREEN")
    .setAuthor(`This verification becomes invalid after 30s.`)
    .setDescription(`Do you want to UnMute ${tounmute}?`)

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reactioncollector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);
            let unmuteRole = message.guild.roles.cache.find(m => m.name === "Muted");
        
        // Verification stuffs
        if (emoji === "✅") {
            msg.delete();
            tounmute.roles.remove(unmuteRole)
                .catch(err => {
                    if (err) return message.channel.send(`Well.... There Is An Error ${err}`)
                });
            logChannel.send('User was Successfully Unmuted.');
        } else if (emoji === "❌") {
            msg.delete();

            message.reply(`UnMute As Been Cancelled!.`).then(msg => {
                msg.delete({ timeout: 10000 })
            })
        }
    })
}

exports.help = {
    name: "unmute",
    description: "This Command Makes Users To Mutes From The Server!",
    usage: "unmute <id | mention>",
    example: "unmute @GOOGLE#google"
 };
 
 exports.conf = {
       aliases: [],
 }   