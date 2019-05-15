const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    let roleMember = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!roleMember)
        return message.channel.send("Couldn't find user");

    if(!message.member.hasPermission("MANAGE_ROLES")) return message.reply("You are not allowed to modify roles in this server");
    else if(message.member.highestRole.comparePositionTo(roleMember.highestRole) <= 0) return message.reply("You can only modify roles of people of a lower rank than you");

    let role = args.join(" ").slice(22);
    if(!role) 
        return message.reply("Please specify role");

    let guildRole = message.guild.roles.find('name', role);
    if(!guildRole) 
        return message.reply("Invalid role");
        
    if(message.member.highestRole.comparePositionTo(guildRole) <= 0) return message.channel.send("You can only modify roles of a lower rank than you");

    if(!roleMember.roles.has(guildRole.id))
        return message.reply(`They don't have the ${guildRole.name} role`);

    roleMember.removeRole(guildRole.id);
    
    message.channel.send(`The ${guildRole.name} role has been revoked from ${roleMember}`);
    
    let botIcon = bot.user.displayAvatarURL;

    let messageEmbed = new Discord.RichEmbed()
    .setDescription("Role Removed")
    .setAuthor(message.author.username)
    .setColor("#ff0000")
    .setThumbnail(botIcon)
    .addField("Demoted User", roleMember)
    .addField("Role Removed", guildRole)

    let logChannel = message.guild.channels.find('name', "moderation-log");
    if(!logChannel) 
        return message.channel.send("Couldn't find log channel");

    logChannel.send(messageEmbed);
}

module.exports.help = {
    name: "removerole"
}