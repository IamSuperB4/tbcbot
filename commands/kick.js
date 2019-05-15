const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let kickUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kickUser)
        return message.channel.send("Couldn't find user");

    let reason = args.join(" ").slice(22);

    if(!message.member.hasPermission("KICK_MEMBERS")) 
        return message.reply("You are not allowed to kick in this server");

    else if(message.member.highestRole.comparePositionTo(kickUser.highestRole) <= 0)
        return message.reply("You can only kick people of a lower rank than you");
    

    let messageEmbed = new Discord.RichEmbed()
    .setDescription("**Kick**")
    .setColor("#ff0000")
    .addField("Kicked User", `${kickUser} with ID: ${kickUser.id}`)
    .addField("Kicked By", `@<${message.author}> with ID: ${message.author.id}`)
    .addField("Kicked In", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", reason);

    let logChannel = message.guild.channels.find('name', "moderation-log");
    if(!logChannel) 
        return message.channel.send("Couldn't find kick channel");

    message.guild.member(kickUser).kick(reason);
    logChannel.send(messageEmbed);

    return;
}

module.exports.help = {
    name: "kick"
}