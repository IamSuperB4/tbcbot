require("http").createServer(async (req,res) => 
    { res.statusCode = 200; res.write("ok"); res.end(); }).listen(3000, () => console.log("Now listening on port 3000"));

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

    let welcomeChannel = member.guild.channels.find('name', "newcomer");
    welcomeChannel.send(`Welcome to The Bloons Citadel ${member}!`);

    let guildRole = member.guild.roles.find('name', "muted");
    console.log(guildRole.id);
    
    await(member.addRole(guildRole));
});

bot.on("guildMemberRemove", async member => {
    console.log(`${member.id} has left the server`);

    let welcomeChannel = member.guild.channels.find('name', "newcomer");
    welcomeChannel.send(`${member} has left the server!`);
});

bot.on("guildBanAdd", async (guild, member) => {
    console.log(`${member.id} was banned`);

    let banChannel = guild.channels.find('name', "moderation-log");
    console.log(banChannel);
    
    banChannel.send(`${member} was banned!`);
});

bot.on("guildBanRemove", async (guild, member) => {
    console.log(`${member.id} has been ununbanned`);

    let banChannel = guild.channels.find('name', "moderation-log");
    console.log(banChannel);
    banChannel.send(`${member} has been unbanned!`);
});

bot.on("channelCreate", async channel => {
    console.log(`${channel.name} has been created`);

    let sChannel = channel.guild.channels.find('name', "moderation-log");
    sChannel.send(`${channel} has been created!`);
});

bot.on("channelDelete", async channel => {
    console.log(`${channel.name} has been deleted`);

    let sChannel = channel.guild.channels.find('name', "moderation-log");
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

bot.on('message', message => {
      if(message.content.includes("<@578032411997110292>")) {
          if(message.content.includes("hello")
          || message.content.includes("Hello")
          || message.content.includes("Hi")
          || message.content.includes("hi")
          || message.content.includes("Howdy")
          || message.content.includes("howdy")
          || message.content.includes("Hey")
          || message.content.includes("hey")
          || message.content.includes("hola")
          || message.content.includes("Hola")
          || message.content.includes("Bonjour")
          || message.content.includes("bonjour")) {
            let randomNumber = Math.floor(Math.random() * 6);
            if(randomNumber == 0) message.channel.send(`Hello ${message.member}`);
            if(randomNumber == 1) message.channel.send(`Hi ${message.member}`);
            if(randomNumber == 2) message.channel.send(`Hey ${message.member}`);
            if(randomNumber == 3) message.channel.send(`Howdy ${message.member}`);
            if(randomNumber == 4) message.channel.send(`Hola ${message.member} mi amigo`);
            if(randomNumber == 5) message.channel.send(`Bonjour ${message.member}`);
          }

          if(message.content.includes("How")
          && message.content.includes("day")
          || message.content.includes("how")
          && message.content.includes("day")) {
            let randomNumber = Math.floor(Math.random() * 6);
            if(randomNumber == 0) message.channel.send(`Ehhh ${message.member}`);
            if(randomNumber == 1) message.channel.send(`Not too bad, how about yours ${message.member}?`);
            if(randomNumber == 2) message.channel.send(`Kinda boring just sitting here all day ${message.member}`);
            if(randomNumber == 3) message.channel.send(`It's amazing going amazing! How about yours ${message.member}?`);
            if(randomNumber == 4) message.channel.send(`I gotta say, it's been a good day ${message.member}`);
            if(randomNumber == 5) message.channel.send(`I'm liking it so far. How's your day ${message.member}?`);
          }
      }
});



bot.login(auth.token);