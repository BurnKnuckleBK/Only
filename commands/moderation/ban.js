const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

exports.run = async (client, message, args) => {
        const logChannel = message.guild.channels.cache.find(c => c.name === "logs") || message.channel;

        if (message.deletable) message.delete();

        // No args
        if (!args[0]) {
            return message.reply("Please Provide a Person To Ban.").then(msg => {
                msg.delete({ timeout: 5000 })
            })
        }

        // No reason
        if (!args[1]) {
            return message.reply("Please Provide A Reason To Ban.").then(msg => {
                msg.delete({ timeout: 5000 })
            })
        }

        // No author permissions
        if (!message.member.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ You Don't Have Permissions To Ban Members. Please Contact a staff member").then(msg => {
                msg.delete({ timeout: 5000 })
            })
        
        }
        // No bot permissions
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ I Don't Have Permissions To Ban Members. Please Contact BurnKnuckle").then(msg => {
                msg.delete({ timeout: 5000 })
            })
        }

        const toBan = message.mentions.members.first() || message.guild.members.get(args[0]);

        // No member found
        if (!toBan) {
            return message.reply("Couldn't Find That Member, Finger Him To Find Him!").then(msg => {
                msg.delete({ timeout: 5000 })
            })
        }

        // Can't ban urself
        if (toBan.id === message.author.id) {
            return message.reply("You Can't Ban Yourself KID!").then(msg => {
                msg.delete({ timeout: 5000 })
            })
        }

        // Check if the user's banable
        if (!toBan.bannable) {
            return message.reply("I Can't Ban That Person Due To Role Hierarchy.").then(msg => {
                msg.delete({ timeout: 5000 })
            })
        }
        
        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**Baned Member:** ${toBan} (${toBan.id})
            **- Baned by:** ${message.member} (${message.member.id})
            **- Reason:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`This verification becomes invalid after 30s.`)
            .setDescription(`Do You Want To Ban ${toBan}?`)

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reactioncollector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // Verification stuffs
            if (emoji === "✅") {
                msg.delete();

                toBan.ban({ days: 7, reason: args.slice(1).join(" ") })
                    .catch(err => {
                        if (err) return message.channel.send(`Well.... There Is An Error ${err}`)
                    });

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`Ban As Been Cancelled!.`).then(msg => {
                    msg.delete({ timeout: 10000 })
                })
            }
        });
    }

exports.help = {
    name: "ban",
    description: "This Command Makes Users To Ban From The Server!",
    usage: "ban <id | mention>",
    example: "ban @GOOGLE#google"
};

exports.conf = {
    aliases: [],
}   