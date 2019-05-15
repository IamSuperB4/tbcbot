const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let botIcon = bot.user.displayAvatarURL;

    let botEmbed = new Discord.RichEmbed()
    .setDescription("Bot Information")
    .setColor("#ff0000")
    .setThumbnail(botIcon)
    .addField("Bot name", bot.user.username)
    .addField("Created On", bot.user.createdAt);

    return message.channel.send(botEmbed);
}

module.exports.help = {
    name: "botinfo"
}