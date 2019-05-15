const Discord = require("discord.js");
const fs = require("fs");
let cagedRoles = JSON.parse(fs.readFileSync("./cagedroles.json", "utf8"));

module.exports.run = async (bot, message, args) => {
    
    let selectedMember = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    if(!selectedMember)
        return message.channel.send("Couldn't find user");

    let reason = args.join(" ").slice(22);

    
    if(reason == "") return message.reply("Please state a reason for warning (Ex: !warn @user reason)")

    if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("You are not allowed to cage in this server");
    else if(message.member.highestRole.comparePositionTo(selectedMember.highestRole) <= 0) return message.reply("You can only cage people of a lower rank than you");

    roleArray = new Array();

    for(let i = 1; i <= selectedMember.roles.array().length-1; i++) {
        roleArray[i-1] = selectedMember.roles.array()[i].name;

        let guildRole = message.guild.roles.find('name', roleArray[i-1]);
        

        setTimeout(function () {
            selectedMember.removeRole(guildRole.id);
            message.channel.send(roleArray[i-1]  + " removed");
        }, 250);
    }

    setTimeout(function () {
        message.channel.send("Penalty box added. Successful Caging!");


        if(!cagedRoles[selectedMember.id]) 
            cagedRoles[selectedMember.id] = {
                roles: roleArray
             };

        cagedRoles[selectedMember.id].roles = roleArray;

        fs.writeFile("./cagedroles.json", JSON.stringify(cagedRoles), (err) => {
            if(err) log(err);
        });

        let guildRole = message.guild.roles.find('name', "Penalty box");
        selectedMember.addRole(guildRole.id);

        let botIcon = bot.user.displayAvatarURL;

        let messageEmbed = new Discord.RichEmbed()
        .setDescription("Caged")
        .setAuthor(message.author.username)
        .setColor("#ff0000")
        .setThumbnail(botIcon)
        .addField("Caged user", selectedMember)
        .addField("Caged in", message.channel)
        .addField("Reason", reason);
    
        let logChannel = message.guild.channels.find('name', "moderation-log");
        if(!logChannel) 
            return message.channel.send("Couldn't find warn channel");
    
        logChannel.send(messageEmbed);

    }, 3000);
}

module.exports.help = {
    name: "cage"
}