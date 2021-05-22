moment = require('moment')
exports.run = (client, message, args) => {
        let user = message.mentions.users.first() || message.author;

        function game() {
            let game;
            if (user.presence.activities.length >= 1) game = `${user.presence.activities[0].type} ${user.presence.activities[0].name}`;
            else if (user.presence.activities.length < 1) game = "None"; // This will check if the user doesn't playing anything.
            return game; // Return the result.
    }
        let x = Date.now() - user.createdAt; // Since the user created their account.
        let y = Date.now() - message.guild.members.cache.get(user.id).joinedAt; // Since the user joined the server.
        let created = Math.floor(x / 86400000); // 5 digits-zero.
        let joined = Math.floor(y / 86400000);
        
        const member = message.guild.member(user);
        let nickname = member.nickname !== undefined && member.nickname !== null ? member.nickname : "None";
        let createdate = moment.utc(user.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss"); // User Created Date
        let joindate = moment.utc(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss"); // User Joined the Server Date
        let status = user.presence.status;
        let avatar = user.avatarURL({size: 2048}); // Use 2048 for high quality avatar.
        
        const embed = new Discord.MessageEmbed()
        .setAuthor(user.tag, avatar)
        .setThumbnail(avatar)
        .setTimestamp()
        .setColor(0x7289DA)
        .addField("ID", user.id, true)
        .addField("Nickname", nickname, true)
        .addField("Created Account Date", `${createdate} \nsince ${created} day(s) ago`, true)
        .addField("Joined Guild Date", `${joindate} \nsince ${joined} day(s) ago`, true)
        .addField("Game", game(), true)
        
        message.channel.send(embed);
}
exports.help = {
    name: "userinfo",
    description: "Tells Yours Or Another Users Full Information!",
    usage: "[mention]",
    example: "userinfo @GOOGLE#google"
};

exports.conf = {
    aliases: ['userio'],
}   