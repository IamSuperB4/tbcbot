require("http").createServer(async (req,res) => 
    { res.statusCode = 200; res.write("ok"); res.end(); }).listen(3000, () => console.log("Now listening on port 3000"));

const auth = require("./auth.json");
const Discord = require("discord.js");
const bot = new Discord.Client({ disableEveryone: true });
const fs = require("fs");
const token = process.env.token;

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
          || message.content.includes("Hi ")
          || message.content.includes("hi ")
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
            if(randomNumber == 2) message.channel.send(`Kinda boring just sitting here all day. You ${message.member}?`);
            if(randomNumber == 3) message.channel.send(`It's going amazing! How about yours ${message.member}?`);
            if(randomNumber == 4) message.channel.send(`I gotta say, it's been a good day. How's yours ${message.member}?`);
            if(randomNumber == 5) message.channel.send(`I'm liking it so far. How's your day ${message.member}?`);
          }
          
          if(message.content.includes("Thank")
          || message.content.includes("thank")) {
            let randomNumber = Math.floor(Math.random() * 6);
            if(randomNumber == 0) message.channel.send(`You're welcome ${message.member}!`);
            if(randomNumber == 1) message.channel.send(`No problem ${message.member}`);
            if(randomNumber == 2) message.channel.send(`Np ${message.member}`);
            if(randomNumber == 3) message.channel.send(`Anytime! ${message.member}!`);
            if(randomNumber == 4) message.channel.send(`Happy to be of service ${message.member}!`);
            if(randomNumber == 5) message.channel.send(`Happy to help ${message.member}`);
          }
          
          if(message.content.includes("lucky")
          && message.content.includes("number")) {
            let randomNumber = Math.floor(Math.random() * 1000);
            message.channel.send(`${randomNumber} ${message.member}!`);
          }
          
          if(message.content.includes("8")
          && message.content.includes("ball")
          || message.content.includes("8")
          && message.content.includes("Ball")
          || message.content.includes("eight")
          && message.content.includes("ball")
          || message.content.includes("eight")
          && message.content.includes("Ball")) {
            let randomNumber = Math.floor(Math.random() * 20);
            if(randomNumber == 0) message.channel.send(`It is certain ${message.member}`);
            if(randomNumber == 1) message.channel.send(`It is decidedly so ${message.member}`);
            if(randomNumber == 2) message.channel.send(`Without a doubt ${message.member}`);
            if(randomNumber == 3) message.channel.send(`Yes - Definitely ${message.member}`);
            if(randomNumber == 4) message.channel.send(`You may rely on it ${message.member}`);
            if(randomNumber == 5) message.channel.send(`As I see it, yes ${message.member}`);
            if(randomNumber == 6) message.channel.send(`Most likely ${message.member}`);
            if(randomNumber == 7) message.channel.send(`Outlook good ${message.member}`);
            if(randomNumber == 8) message.channel.send(`Yes ${message.member}`);
            if(randomNumber == 9) message.channel.send(`Signs point to yes ${message.member}`);
            if(randomNumber == 10) message.channel.send(`Reply hazy, try again ${message.member}`);
            if(randomNumber == 11) message.channel.send(`Ask again later ${message.member}`);
            if(randomNumber == 12) message.channel.send(`Better not tell you now ${message.member}`);
            if(randomNumber == 13) message.channel.send(`Cannot predict now ${message.member}`);
            if(randomNumber == 14) message.channel.send(`Concentrate and ask again ${message.member}`);
            if(randomNumber == 15) message.channel.send(`Don't count on it ${message.member}`);
            if(randomNumber == 16) message.channel.send(`My reply is no ${message.member}`);
            if(randomNumber == 17) message.channel.send(`My sources say no ${message.member}`);
            if(randomNumber == 18) message.channel.send(`Outlook not so good ${message.member}`);
            if(randomNumber == 19) message.channel.send(`Very doubtful ${message.member}`);
          }
          
          if(message.content.includes("Win")
          && message.content.includes("?")
          || message.content.includes("win")
          && message.content.includes("?")) {
            let randomNumber = Math.floor(Math.random() * 10);
            if(randomNumber == 0) message.channel.send(`Yes ${message.member}`);
            if(randomNumber == 1) message.channel.send(`Not today ${message.member}`);
            if(randomNumber == 2) message.channel.send(`Yes, $5 ${message.member}`);
            if(randomNumber == 3) message.channel.send(`No, you actually lost ${message.member}`);
            if(randomNumber == 4) message.channel.send(`I don't think so ${message.member}`);
            if(randomNumber == 5) message.channel.send(`Let me check my books... no ${message.member}`);
            if(randomNumber == 6) message.channel.send(`Let me check my books... yes ${message.member}`);
            if(randomNumber == 7) message.channel.send(`You did win ${message.member}`);
            if(randomNumber == 8) message.channel.send(`All the time ${message.member}`);
            if(randomNumber == 9) message.channel.send(`Not for a while ${message.member}`);
          }
          
          if(message.content.includes("like")
          && message.content.includes("me")
          || message.content.includes("Like")
          && message.content.includes("Me")) {
            let randomNumber = Math.floor(Math.random() * 5);
            if(randomNumber == 0) message.channel.send(`I do, yes ${message.member}!`);
            if(randomNumber == 1) message.channel.send(`Of course ${message.member}!`);
            if(randomNumber == 2) message.channel.send(`Why wouldn't I ${message.member}?`);
            if(randomNumber == 3) message.channel.send(`I'll always be your friend ${message.member}!`);
            if(randomNumber == 4) message.channel.send(`You don't need to worry about that ${message.member}!`);
          }
          
          if(message.content.includes("Best")
          && message.content.includes("clan")
          || message.content.includes("best")
          && message.content.includes("clan")) {
            let randomNumber = Math.floor(Math.random() * 4);
            if(randomNumber == 0) message.channel.send(`The Bloons Academy ${message.member}!`);
            if(randomNumber == 1) message.channel.send(`The Bloons Remastered ${message.member}!`);
            if(randomNumber == 2) message.channel.send(`The Bloons Masters ${message.member}!`);
            if(randomNumber == 3) message.channel.send(`All the TBC clans! How could I choose ${message.member}!`);
          }
          
          if(message.content.includes("Best")
          && message.content.includes("leader")
          || message.content.includes("best")
          && message.content.includes("leader")
          || message.content.includes("best")
          && message.content.includes("Leader")
          || message.content.includes("Best")
          && message.content.includes("Leader")) {
            let randomNumber = Math.floor(Math.random() * 5);
            if(randomNumber == 0) message.channel.send(`IamSuperB4 without a doubt ${message.member}!`);
            if(randomNumber == 1) message.channel.send(`I'd have to say it's IamSuperB4 ${message.member}!`);
            if(randomNumber == 2) message.channel.send(`You know who it is! It's IamSuperB4 ${message.member}!`);
            if(randomNumber == 3) message.channel.send(`IamSuperB4 ${message.member}!`);
            if(randomNumber == 4) message.channel.send(`What kind of a question is that? It's IamSuperB4 ${message.member}!`);
          }
      }

      if(message.content.includes("dog")
      && message.content.includes("pic")
      || message.content.includes("Dog")
      && message.content.includes("pic")
      || message.content.includes("dog")
      && message.content.includes("Pic")
      || message.content.includes("Dog")
      && message.content.includes("Pic")) {
        getAPI('https://dog.ceo/api/breeds/image/random', getDogs, true);
      }

      function getDogs(data) {
        message.channel.send("My Bot's message", {files: [data.message[1]]});
      }
      
      function getAPI(finalURL, functionName, json) {
        if (json == true) {
          fetch(finalURL)
           .then(checkStatus)
           .then(JSON.parse)
           .then(functionName)
           .catch(catchError);
        }
      }
      
      function checkStatus(response) {
        const OK = 200;
        const ERROR = 300;
        if (response.status >= OK && response.status < ERROR) {
          return response.text();
        }
        else {
          return Promise.reject(new Error(response.status +
                                           ": " + response.statusText));
        }
      }
      
      /**
       * Alert the user that there was an error, and log the error
       * @param {error} error - error sent from catch
       */
      function catchError(error) {
        alert("Oops! Something didn't work right. Please refresh the page and try again");
        console.log(error);
      }
});





bot.login(token);