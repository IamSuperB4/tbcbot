const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("KICK_MEMBERS"))
        return message.reply("You can't mute them!");

    let warnUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!warnUser)
        return message.reply("Couldn't find member");

    let warnlevel = warns[warnUser.id].warns;

    message.reply(`${warnUser} has ${warnlevel} warnings`);

}

module.exports.help = {
    name: "warnlevel"
}