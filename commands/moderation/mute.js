const { MessageEmbed } = require("discord.js")
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");
exports.run = async (client, message, args) => {
   const logChannel = message.guild.channels.cache.find(c => c.name === "logs") || message.channel;

   if (message.deletable) message.delete();

   // No args
   if (!args[0]) {
       return message.reply("Please provide a person to Mute.").then(msg => {
           msg.delete({ timeout: 5000 })
       })
   }

   // No reason
   if (!args[1]) {
       return message.reply("Please provide a reason to Mute.").then(msg => {
           msg.delete({ timeout: 5000 })
       })
   }

   // No author permissions
   if (!message.member.hasPermission("ADMINISTRATOR")) {
       return message.reply("❌ You do not have permissions to Mute members. Please contact a staff member").then(msg => {
           msg.delete({ timeout: 5000 })
       })
   
   }
   // No bot permissions
   if (!message.guild.me.hasPermission("ADMINISTRATOR")) {
       return message.reply("❌ I do not have permissions to Mute members. Please contact a staff member").then(msg => {
           msg.delete({ timeout: 5000 })
       })
   }

   const tomute = message.mentions.members.first() || message.guild.members.get(args[0]);

   // No member found
   if (!tomute) {
       return message.reply("Couldn't find that member, try again").then(msg => {
           msg.delete({ timeout: 5000 })
       })
   }

   // Can't ban urself
   if (tomute.id === message.author.id) {
       return message.reply("You can't Mute yourself...").then(msg => {
           msg.delete({ timeout: 5000 })
       })
   }

   const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(tomute.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`** Muted The Member:** ${tomute}
            **- Muted by:** ${message.member}
            **- Reason For Mute:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`This verification becomes invalid after 30s.`)
            .setDescription(`Do you want to mute ${tomute}?`)

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reactioncollector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);
            let muteRole = message.guild.roles.cache.find(m => m.name === "Muted");
            if (!muteRole) {
               try {
                  message.guild.roles.create({
                      data: {
                        name: "Muted",
                        color: "#000000",
                        },
                        reason: 'For Muting The Person',
                }) 

                  message.guild.channels.cache.forEach(async (channel, id) => {
                     await channel.createOverwrite(muteRole, {
                        SEND_MESSAGES: false,
                        MANAGE_MESSAGES: false,
                        READ_MESSAGES: false,
                        ADD_REACTIONS: false
                     });
                  });
               } catch(e) {
               console.log(e.stack);
             }
           }

            // Verification stuffs
            if (emoji === "✅") {
                msg.delete();
                tomute.roles.add(muteRole)
                    .catch(err => {
                        if (err) return message.channel.send(`Well.... There Is An Error ${err}`)
                    });
                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`Mute As Been Cancelled!.`).then(msg => {
                    msg.delete({ timeout: 10000 })
                })
            }
        });
    
        }
   

exports.help = {
   name: "mute",
   description: "This Command Makes Users To Mutes From The Server!",
   usage: "mute <id | mention>",
   example: "mute @GOOGLE#google"
};

exports.conf = {
      aliases: [],
}   