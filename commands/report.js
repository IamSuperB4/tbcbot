const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser)
        return message.channel.send("Couldn't find user");

    let reason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
    .setDescription("Report")
    .setColor("#ff0000")
    .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
    .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
    .addField("Channel", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", reason);

    let reportsChannel = message.guild.channels.find('name', "bot-test2");
    if(!reportsChannel) 
        return message.channel.send("Couldn't find reports channel");

    message.delete().catch(O_o=>{});
    reportsChannel.send(reportEmbed);

    return;
}

module.exports.help = {
    name: "report"
}