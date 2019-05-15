const Discord = require("discord.js");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {
    let toMute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    if(!toMute) return message.reply("Couldn't find user");
    if(!message.member.hasPermission("KICK_MEMBERS"))
        return message.reply("You can't mute them!");

    let muteRole = message.guild.roles.find('name', "muted");
    
    
    // create a role
    if(!muteRole) {
        try {
            muteRole = await message.guild.createRole({
                name: "muted",
                color: "#000000",
                permissions: []
            });
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(muteRole, {
                    SEND_MESSGAGES: false,
                    ADD_REACTIONS: false
                });
            });
        } 
        catch (error) {
            console.log(error.stack);
        }
    }
    
    let muteTime = args[1];
    if(!muteTime) return message.reply("Please specifiy a time");

    await(toMute.addRole(muteRole.id));
    message.reply(`${toMute} has been muted for ${ms(ms(muteTime))}`);

    setTimeout(function() {
        toMute.removeRole(muteRole.id);
        message.channel.send(`${toMute} has been unmuted`);
    }, ms(muteTime));

}

module.exports.help = {
    name: "mute"
}