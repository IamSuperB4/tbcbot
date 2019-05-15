const Discord = require("discord.js");
const fs = require("fs");
let cagedRoles = JSON.parse(fs.readFileSync("./cagedroles.json", "utf8"));

module.exports.run = async (bot, message, args) => {
    
    let selectedMember = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("You are not allowed to uncage in this server");
    else if(message.member.highestRole.comparePositionTo(selectedMember.highestRole) <= 0) return message.reply("You can only uncage people of a lower rank than you");

    roleArray = cagedRoles[selectedMember.id].roles;

    for(let i = 1; i <= roleArray.length; i++) {
        let guildRole = message.guild.roles.find('name', roleArray[i-1]);
        

        setTimeout(function () {
            selectedMember.addRole(guildRole.id);
            message.channel.send(roleArray[i-1]  + " added");
        }, 250);
    }

    setTimeout(function () {
        message.channel.send("Penalty box removed. Original roles were put back. Successful uncaging!");

        let guildRole = message.guild.roles.find('name', "muted");
        selectedMember.removeRole(guildRole.id);

    }, 3000);

    let botIcon = bot.user.displayAvatarURL;

    let messageEmbed = new Discord.RichEmbed()
    .setDescription("Caged")
    .setAuthor(message.author.username)
    .setColor("#ff0000")
    .setThumbnail(botIcon)
    .addField("Uncaged user", warnUser)
    .addField("Reason", reason);

    let logChannel = message.guild.channels.find('name', "moderation-log");
    if(!logChannel) 
        return message.channel.send("Couldn't find log channel");

    logChannel.send(messageEmbed);
}

module.exports.help = {
    name: "uncage"
}