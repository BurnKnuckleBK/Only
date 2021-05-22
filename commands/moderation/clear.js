exports.run = async (client, message, args) => {
        if (message.deletable) {
            message.delete();
        }
    
        // Member doesn't have permissions
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("You can't delete messages....").then(msg => {
                msg.delete({ timeout: 5000 })
            })
        }

        // Check if args[0] is a number
        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.reply("Please Provide Number More Than 1").then(msg => {
                msg.delete({ timeout: 5000 })
            })
        }

        // Maybe the bot can't delete messages
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("I Don't Have Permission To Delete Messages ").then(msg => {
                msg.delete({ timeout: 5000 })
            })
        }

        let deleteAmount;

        if (parseInt(args[0]) > 100) {
            deleteAmount = 100;
        } else {
            deleteAmount = parseInt(args[0]);
        }

        deleted = message.channel.bulkDelete(deleteAmount, true)
        .then(deleted => message.channel.send(`I deleted \`${deleted.size}\` messages.`).then(msg => {
            msg.delete({ timeout: 2000 })
          }))

        .catch(err => message.reply(`Something went wrong... ${err}`));
    }

exports.help = {
    name: "clear",
    description: "This Command Clears The Chat!",
    usage: "clear <Number>",
    example: "ban 4"
};

exports.conf = {
    aliases: ["purge", "nuke"],
}   