const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("KICK_MEMBERS"))
        return message.reply("You can't warn anybody in our server. Contact a mod or leader if you're having an issue with somebody");

    let warnUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!warnUser)
        return message.reply("Couldn't find member");

    else if(message.member.highestRole.comparePositionTo(warnUser.highestRole) <= 0) 
    {
        return message.reply("You can only warn people of a lower rank than you");
    }


    let reason = args.join(" ").slice(22);

    if(reason == "") return message.reply("Please state a reason for warning (Ex: !warn @user reason)")


    if(!warns[warnUser.id]) 
        warns[warnUser.id] = {
            warns: 0
        };

    warns[warnUser.id].warns++;
    fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
        if(err) log(err);
    });
    
    let botIcon = bot.user.displayAvatarURL;

    let messageEmbed = new Discord.RichEmbed()
    .setDescription("Warns")
    .setAuthor(message.author.username)
    .setColor("#ff0000")
    .setThumbnail(botIcon)
    .addField("Warned user", warnUser)
    .addField("Warned in", message.channel)
    .addField("Number of warnings", warns[warnUser.id].warns)
    .addField("Reason", reason);

    message.channel.send(`You've been warned ${warnUser}`);

    let logChannel = message.guild.channels.find('name', "moderation-log");
    if(!logChannel) 
        return message.channel.send("Couldn't find warn channel");

    logChannel.send(messageEmbed);

    return;
}

module.exports.help = {
    name: "warn"
}