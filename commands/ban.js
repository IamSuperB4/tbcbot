const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let banUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!banUser)
            return message.channel.send("Couldn't find user");

        let reason = args.join(" ").slice(22);

        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("You are not allowed to ban in this server");
        else if(message.member.highestRole.comparePositionTo(banUser.highestRole) <= 0) return message.reply("You can only ban people of a lower rank than you");
    

        let messageEmbed = new Discord.RichEmbed()
        .setDescription("~Banned~")
        .setColor("#ff0000")
        .addField("Banned User", `${banUser} with ID: ${banUser.id}`)
        .addField("Banned By", `${message.author} with ID: ${message.author.id}`)
        .addField("Banned In", message.channel)
        .addField("Time", message.createdAt)
        .addField("Reason", reason);

        let logChannel = message.guild.channels.find('name', "bot-test2");
        if(!logChannel) 
            return message.channel.send("Couldn't find ban channel");

        message.guild.member(banUser).ban(reason);
        logChannel.send(messageEmbed);

        return;
}

module.exports.help = {
    name: "ban"
}