require("http").createServer(async (req,res) => { res.statusCode = 200; res.write("ok"); res.end(); }).listen(3000, () => console.log("Now listening on port 3000"));

const auth = require("./auth.json");
const Discord = require("discord.js");
const bot = new Discord.Client({ disableEveryone: true });
const fs = require("fs");

bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");

    if(jsfile.length <= 0) {
        console.log("Couldn't find commands");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);
        
    });
})

bot.on("ready", async () => {
    console.log(`${bot.user.username} is updated!` );
    bot.user.setActivity("the Discord", { type: 'WATCHING' });
});

bot.on("guildMemberAdd", async member => {
    console.log(`${member.id} joined the server`);

    let welcomeChannel = member.guild.channels.find('name', "welcome");
    welcomeChannel.send(`${member} has joined the server!`);

    let guildRole = member.guild.roles.find('name', "muted");
    console.log(guildRole.id);
    
    await(member.addRole(guildRole));
});

bot.on("guildMemberRemove", async member => {
    console.log(`${member.id} has left the server`);

    let welcomeChannel = member.guild.channels.find('name', "welcome");
    welcomeChannel.send(`${member} has left the server!`);
});

bot.on("guildBanAdd", async (guild, member) => {
    console.log(`${member.id} was banned`);

    let banChannel = guild.channels.find('name', "bot-test2");
    console.log(banChannel);
    
    banChannel.send(`${member} was banned!`);
});

bot.on("guildBanRemove", async (guild, member) => {
    console.log(`${member.id} has been ununbanned`);

    let banChannel = guild.channels.find('name', "bot-test2");
    console.log(banChannel);
    banChannel.send(`${member} has been unbanned!`);
});

bot.on("channelCreate", async channel => {
    console.log(`${channel.name} has been created`);

    let sChannel = channel.guild.channels.find('name', "bot-test");
    sChannel.send(`${channel} has been created!`);
});

bot.on("channelDelete", async channel => {
    console.log(`${channel.name} has been deleted`);

    let sChannel = channel.guild.channels.find('name', "bot-test");
    sChannel.send(`${channel.name} has been deleted!`);
});

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = auth.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    // run any command that has a js file
    let commandFile = bot.commands.get(cmd.slice(prefix.length));
    if(commandFile) commandFile.run(bot, message, args);
});

bot.login(auth.token);