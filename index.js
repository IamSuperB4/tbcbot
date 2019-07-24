require("http").createServer(async (req,res) => 
    { res.statusCode = 200; res.write("ok"); res.end(); }).listen(3000, () => console.log("Now listening on port 3000"));

const auth = require("./auth.json");
const Discord = require("discord.js");
const bot = new Discord.Client({ disableEveryone: true });
const fs = require("fs");
const token = process.env.token;
const r2 = require("r2");
const querystring = require('querystring');
const CAT_API_URL   = "https://api.thecatapi.com/"
const catAPIkey = '19308d7f-a90a-4099-b497-dbd7b2d8117e';

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
    let welcomeChannel = member.guild.channels.find('name', "newcomer");
    welcomeChannel.send(`Welcome to The Bloons Citadel ${member}!`);

    let guildRole = member.guild.roles.find('name', "Guest");
    member.addRole(guildRole.id);
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

bot.on('messageDelete', message => {
  let logChannel = message.guild.channels.find('name', "message-log");

  let profilePic = message.author.displayAvatarURL;

    let messageEmbed = new Discord.RichEmbed()
    .setDescription("Deleted Message")
    .setAuthor(message.author.username)
    .setColor("#ff0000")
    .setThumbnail(profilePic)
    .addField("Message Content", message.cleanContent)
    .addField("Channel", message.channel)
    .addField("Date/Time", new Date());

  logChannel.send(messageEmbed);
});

bot.on('messageUpdate', async(oldMessage, newMessage) => {
  if(oldMessage.content != newMessage.content) {
    let logChannel = oldMessage.guild.channels.find('name', "message-log");
  
    let profilePic = oldMessage.author.displayAvatarURL;
    
    try {
      let messageEmbed = new Discord.RichEmbed()
      .setDescription("Edited Message")
      .setAuthor(oldMessage.author.username)
      .setColor("#00FF00")
      .setThumbnail(profilePic)
      .addField("Before", oldMessage)
      .addField("After", newMessage)
      .addField("Channel", oldMessage.channel)
      .addField("Date/Time", new Date());
  
      logChannel.send(messageEmbed);
    } 
    catch (error) {
      console.log(error);
    }
  }
});

bot.on('userUpdate', async(oldUser, newUser) => {
  console.log(`Old: ${oldUser.username}`);
  console.log(`New: ${newUser.username}`);

  let oldUsername = oldUser.username;
  let newUsername = newUser.username;

  if(oldUsername != newUsername) {
    let logChannel = bot.channels.get("582470509740949514");
    
    let profilePic = newUser.displayAvatarURL;
    
    try {
      let messageEmbed = new Discord.RichEmbed()
      .setDescription("Name Change")
      .setAuthor(oldUser.username)
      .setColor("#00FF00")
      .setThumbnail(profilePic)
      .addField("Before", oldUsername)
      .addField("After", newUsername)
      .addField("Date/Time", new Date());
  
    logChannel.send(messageEmbed);
    } 
    catch (error) {
      console.log(error);
    }
  }
  else {
    let logChannel = bot.channels.get("582470509740949514");
    let oldProfilePic = oldUser.displayAvatarURL;
    let newProfilePic = newUser.displayAvatarURL;
    
    try {
      let messageEmbed = new Discord.RichEmbed()
      .setDescription("Profile Picture Change (Before)")
      .setAuthor(oldUser.username)
      .setColor("#00FF00")
      .setThumbnail(oldProfilePic)
      .addField("Before", "Shown on right of this message")

      let messageEmbed2 = new Discord.RichEmbed()
      .setColor("#00FF00")
      .setThumbnail(newProfilePic)
      .addField("After", "Shown on right of this message")
      .addField("Date/Time", new Date());

      logChannel.send(messageEmbed);
      logChannel.send(messageEmbed2);
    } 
    catch (error) {
      console.log(error);
    }
  }
});
    

// chat boat
bot.on('message', message => {
  // Ping Test Bot
  if(message.content.includes("<@578032411997110292>")) {
    

    if(message.content.toLowerCase().includes("test")) {
    }

    // Hello
    if(message.content.toLowerCase().includes("hello")
    || message.content.toLowerCase().includes("hey")
    || message.content.toLowerCase().includes("hi")
    || message.content.toLowerCase().includes("howdy")
    || message.content.toLowerCase().includes("hey")
    || message.content.toLowerCase().includes("hola")
    || message.content.toLowerCase().includes("bonjour")
    || message.content.toLowerCase().includes("zdravstvuyte")
    || message.content.toLowerCase().includes("nǐ hǎo")
    || message.content.toLowerCase().includes("ni hao")
    || message.content.toLowerCase().includes("salve")
    || message.content.toLowerCase().includes("konnichiwa")
    || message.content.toLowerCase().includes("guten tag")
    || message.content.toLowerCase().includes("olá")
    || message.content.toLowerCase().includes("ola")
    || message.content.toLowerCase().includes("anyoung")
    || message.content.toLowerCase().includes("ahlan")
    || message.content.toLowerCase().includes("greet")) {
      let randomNumber = Math.floor(Math.random() * 14);
      if(randomNumber == 0) message.channel.send(`Hello :wave: ${message.member}`);
      if(randomNumber == 1) message.channel.send(`Hi :wave: ${message.member}`);
      if(randomNumber == 2) message.channel.send(`Hey :wave: ${message.member}`);
      if(randomNumber == 3) message.channel.send(`Howdy :wave: ${message.member}`);
      if(randomNumber == 4) message.channel.send(`Hola :wave: ${message.member}`);
      if(randomNumber == 5) message.channel.send(`Bonjour :wave: ${message.member}`);
      if(randomNumber == 6) message.channel.send(`Zdravstvuyte :wave: ${message.member}`);
      if(randomNumber == 7) message.channel.send(`Nǐ Hǎo :wave: ${message.member}`);
      if(randomNumber == 8) message.channel.send(`Konnichiwa :wave: ${message.member}`);
      if(randomNumber == 9) message.channel.send(`Guten Tag :wave: ${message.member}`);
      if(randomNumber == 10) message.channel.send(`Olá :wave: ${message.member}`);
      if(randomNumber == 11) message.channel.send(`Anyoung :wave: ${message.member}`);
      if(randomNumber == 12) message.channel.send(`Ahlan :wave: ${message.member}`);
      if(randomNumber == 13) message.channel.send(`Greetings, my good sir ${message.member}!`);;
    }

    // How is your day
    if(message.content.toLowerCase().includes("how")
    && message.content.toLowerCase().includes("day")
    || message.content.toLowerCase().includes("how're u goin")) {
      let randomNumber = Math.floor(Math.random() * 6);
      if(randomNumber == 0) message.channel.send(`Ehhh ${message.member}`);
      if(randomNumber == 1) message.channel.send(`Not too bad, how about yours ${message.member}?`);
      if(randomNumber == 2) message.channel.send(`Kinda boring just sitting here all day. You ${message.member}?`);
      if(randomNumber == 3) message.channel.send(`It's going amazing! How about yours ${message.member}?`);
      if(randomNumber == 4) message.channel.send(`I gotta say, it's been a good day. How's yours ${message.member}?`);
      if(randomNumber == 5) message.channel.send(`I'm liking it so far. How's your day ${message.member}?`);
    }
    
    // Thank____
    if(message.content.toLowerCase().includes("thank")) {
      let randomNumber = Math.floor(Math.random() * 6);
      if(randomNumber == 0) message.channel.send(`You're welcome :smile: ${message.member}!`);
      if(randomNumber == 1) message.channel.send(`No problem :grin: ${message.member}`);
      if(randomNumber == 2) message.channel.send(`Np ${message.member}`);
      if(randomNumber == 3) message.channel.send(`Anytime! :smiley: ${message.member}!`);
      if(randomNumber == 4) message.channel.send(`Happy to be of service :grin: ${message.member}!`);
      if(randomNumber == 5) message.channel.send(`Happy to help :smiley: ${message.member}`);
    }
    
    // Lucky number
    if(message.content.toLowerCase().includes("lucky")
    && message.content.toLowerCase().includes("number")) {
      let randomNumber = Math.floor(Math.random() * 1000);
      message.channel.send(`${randomNumber} :four_leaf_clover: ${message.member}!`);
    }
    
    // 8/eight ball
    if(message.content.includes("8")
    && message.content.toLowerCase().includes("ball")
    || message.content.includes("eight")
    && message.content.toLowerCase().includes("ball")) {
      let randomNumber = Math.floor(Math.random() * 20);
      if(randomNumber == 0) message.channel.send(`:8ball: It is certain ${message.member}`);
      if(randomNumber == 1) message.channel.send(`:8ball: It is decidedly so ${message.member}`);
      if(randomNumber == 2) message.channel.send(`:8ball: Without a doubt ${message.member}`);
      if(randomNumber == 3) message.channel.send(`:8ball: Yes - Definitely ${message.member}`);
      if(randomNumber == 4) message.channel.send(`:8ball: You may rely on it ${message.member}`);
      if(randomNumber == 5) message.channel.send(`:8ball: As I see it, yes ${message.member}`);
      if(randomNumber == 6) message.channel.send(`:8ball: Most likely ${message.member}`);
      if(randomNumber == 7) message.channel.send(`:8ball: Outlook good ${message.member}`);
      if(randomNumber == 8) message.channel.send(`:8ball: Yes ${message.member}`);
      if(randomNumber == 9) message.channel.send(`:8ball: Signs point to yes ${message.member}`);
      if(randomNumber == 10) message.channel.send(`:8ball: Reply hazy, try again ${message.member}`);
      if(randomNumber == 11) message.channel.send(`:8ball: Ask again later ${message.member}`);
      if(randomNumber == 12) message.channel.send(`:8ball: Better not tell you now ${message.member}`);
      if(randomNumber == 13) message.channel.send(`:8ball: Cannot predict now ${message.member}`);
      if(randomNumber == 14) message.channel.send(`:8ball: Concentrate and ask again ${message.member}`);
      if(randomNumber == 15) message.channel.send(`:8ball: Don't count on it ${message.member}`);
      if(randomNumber == 16) message.channel.send(`:8ball: My reply is no ${message.member}`);
      if(randomNumber == 17) message.channel.send(`:8ball: My sources say no ${message.member}`);
      if(randomNumber == 18) message.channel.send(`:8ball: Outlook not so good ${message.member}`);
      if(randomNumber == 19) message.channel.send(`:8ball: Very doubtful ${message.member}`);
    }
    
    // Did/will I win
    if(message.content.toLowerCase().includes("did")
    && message.content.toLowerCase().includes("win")
    || message.content.toLowerCase().includes("will")
    && message.content.toLowerCase().includes("win")) {
      let randomNumber = Math.floor(Math.random() * 10);
      if(randomNumber == 0) message.channel.send(`Yes :moneybag: ${message.member}`);
      if(randomNumber == 1) message.channel.send(`Not today ${message.member}`);
      if(randomNumber == 2) message.channel.send(`Yes, $5 :money_mouth: ${message.member}`);
      if(randomNumber == 3) message.channel.send(`No, you actually lost :money_with_wings: ${message.member}`);
      if(randomNumber == 4) message.channel.send(`I don't think so :x: ${message.member}`);
      if(randomNumber == 5) message.channel.send(`Let me check my books... no :books: ${message.member}`);
      if(randomNumber == 6) message.channel.send(`Let me check my books... yes :books: ${message.member}`);
      if(randomNumber == 7) message.channel.send(`You did win :moneybag: ${message.member}`);
      if(randomNumber == 8) message.channel.send(`All the time :money_mouth: ${message.member}`);
      if(randomNumber == 9) message.channel.send(`Not for a while :clock1: ${message.member}`);
    }
    
    // Do you "like me"
    if(message.content.toLowerCase().includes("like")
    && message.content.toLowerCase().includes("me")) {
      let randomNumber = Math.floor(Math.random() * 5);
      if(randomNumber == 0) message.channel.send(`I do, yes :blush: ${message.member}!`);
      if(randomNumber == 1) message.channel.send(`Of course :smile: ${message.member}!`);
      if(randomNumber == 2) message.channel.send(`Why wouldn't I :smiley: ${message.member}?`);
      if(randomNumber == 3) message.channel.send(`I'll always be your friend :slight_smile: ${message.member}!`);;
    }
    
    // Best clan
    if(message.content.toLowerCase().includes("best")
    && message.content.toLowerCase().includes("clan")) {
      let randomNumber = Math.floor(Math.random() * 4);
      if(randomNumber == 0) message.channel.send(`The Bloons Academy :smiley: ${message.member}!`);
      if(randomNumber == 1) message.channel.send(`The Bloons Remastered :smiley: ${message.member}!`);
      if(randomNumber == 2) message.channel.send(`The Bloons Masters :smiley: ${message.member}!`);
      if(randomNumber == 3) message.channel.send(`All the TBC clans! How could I choose :smiley: ${message.member}!`);
    }
    
    // Best leader (IamSuperB4)
    if(message.content.toLowerCase().includes("best")
    && message.content.toLowerCase().includes("leader")) {
      let randomNumber = Math.floor(Math.random() * 5);
      if(randomNumber == 0) message.channel.send(`IamSuperB4 without a doubt :crown: ${message.member}!`);
      if(randomNumber == 1) message.channel.send(`I'd have to say it's IamSuperB4 :crown: ${message.member}!`);
      if(randomNumber == 2) message.channel.send(`You know who it is! It's IamSuperB4 :crown: ${message.member}!`);
      if(randomNumber == 3) message.channel.send(`IamSuperB4 :crown: ${message.member}!`);
      if(randomNumber == 4) message.channel.send(`What kind of a question is that? It's IamSuperB4 :crown: ${message.member}!`);
    }

    // Dog picture
    if(message.content.toLowerCase().includes("dog")
    || message.content.toLowerCase().includes("pup")) {
      //getAPI('https://dog.ceo/api/breeds/image/random', getDogs, true);
      const getData = async url => {
        try {
          const response = await r2(url).json;
          message.channel.send({files: [response.message]});
          //console.log(response.message);
        } catch (error) {
          console.log(error);
        }
      };

      getData('https://dog.ceo/api/breeds/image/random');
    }
    // End of dog picture

    // Cat picture
    if(message.content.toLowerCase().includes("cat")
    || message.content.toLowerCase().includes("kitty")
    || message.content.toLowerCase().includes("kitten")) {

      sendCatPicture();

      async function sendCatPicture()
      {
        try {
          var images = await loadImage(message.author.username);

          // get the Image, and first Breed from the returned object.
          var image = images[0].url;
          message.channel.send({files: [image]});
        }
        catch(error)
        {
          console.log(error)
        }
      }
      
      async function loadImage()
      {
        // you need an API key to get access to all the iamges, or see the requests you've made in the stats for your account
        var headers = {
            'X-API-KEY': catAPIkey,
        }
        var query_params = {
          'limit' : 1       // only need one
        }
        // convert this obejc to query string 
        let queryString = querystring.stringify(query_params);

        try {
          // construct the API Get request url
          let _url = CAT_API_URL + `v1/images/search?${queryString}`;
          // make the request passing the url, and headers object which contains the API_KEY
          var response = await r2.get(_url , {headers} ).json
        } catch (e) {
            console.log(e)
        }
        
        return response;
      }
    }
    // End of cat picture

    // Good job
    if(message.content.toLowerCase().includes("good")
    && message.content.toLowerCase().includes("job")
    || message.content.toLowerCase().includes("nice")
    && message.content.toLowerCase().includes("job")
    || message.content.toLowerCase().includes("well")
    && message.content.toLowerCase().includes("done")
    || message.content.toLowerCase().includes("excellent")
    && message.content.toLowerCase().includes("work")
    || message.content.toLowerCase().includes("great")
    && message.content.toLowerCase().includes("work")
    || message.content.toLowerCase().includes("good")
    && message.content.toLowerCase().includes("work")
    || message.content.toLowerCase().includes("bravo")
    || message.content.toLowerCase().includes("congrat"))
    {
      message.channel.send(`Thank you :smile: ${message.member}!`);
    }

    // Good job
    if(message.content.toLowerCase().includes("you")
    && message.content.toLowerCase().includes("special"))
    {
      message.channel.send(`Yes I am :grin: ${message.member}!`);
    }

    // Good job
    if(message.content.toLowerCase().includes("right")
    || message.content.toLowerCase().includes("aren't you"))
    {
      message.channel.send(`Yes ${message.member}`);
    }
    

    // I love you
    if(message.content.toLowerCase().includes("ily")
    || message.content.toLowerCase().includes("i")
    && message.content.toLowerCase().includes("love")
    && message.content.toLowerCase().includes("you")) 
    {
      message.channel.send(`I love you too :heart: ${message.member}!`);
    }
    
    // Sad -- hate, 
    if(message.content.toLowerCase().includes("ily")
    || message.content.toLowerCase().includes("i")
    && message.content.toLowerCase().includes("love")
    && message.content.toLowerCase().includes("you")) 
    {
      message.channel.send(`I love you too :heart: ${message.member}!`);
    }

    // Meme
    if(message.content.toLowerCase().includes("meme")) {
      message.channel.send(`I'm still collecting memes :pencil: ${message.member}. Send potential memes to IamSuperB4`);
    }

    // Good job
    if(message.content.toLowerCase().includes("bye"))
    {
      message.channel.send(`Goodbye :wave: ${message.member}!`);
    }

    // Good job
    if(message.content.toLowerCase().includes("bye"))
    {
      message.channel.send(`Goodbye :wave: ${message.member}!`);
    }

    // What can I ask you?
    if(message.content.toLowerCase().includes("can")
    && message.content.toLowerCase().includes("ask"))
    {
      message.channel.send(`Bot commands: if you ping the bot, it will respond to:\n
        Hello in 10 different languages and almost any common English way to say hello\n
        Say bye/goodbye to it\n
        Asking how it's day is going\n
        Ask for your lucky number\n
        Ask if you will win anything\n
        Tell TBC bot you love it\n
        Ask if it likes you\n
        Ask what the best clan is\n
        Ask who the best leader is\n
        Congratulate or thank it\n
        \n
        Favorites\n
        Ask for an 8 ball reading (must have the word "8 ball" in the message)\n
        Ask for a dog or cat picture\n
        \n
        More responses coming soon. Please ask for anything you would like it to respond to or issues with the current setup`);
    }

    // Insults
    // F you
    if(message.content.toLowerCase().includes("fuck")
    && message.content.toLowerCase().includes("you")
    || message.content.toLowerCase().includes("fuck")
    && message.content.toLowerCase().includes("u")
    || message.content.toLowerCase().includes("fuk")
    && message.content.toLowerCase().includes("you")
    || message.content.toLowerCase().includes("fuk")
    && message.content.toLowerCase().includes("u")
    || message.content.toLowerCase().includes("fk")
    && message.content.toLowerCase().includes("you")
    || message.content.toLowerCase().includes("fk")
    && message.content.toLowerCase().includes("u")
    || message.content.toLowerCase().includes("f u"))
    {
      let randomNumber = Math.floor(Math.random() * 6);
      if(randomNumber == 0) message.channel.send(`I'm not gonna stoop to your level ${message.member}`);
      if(randomNumber == 1) message.channel.send(`Calm down ${message.member}`);
      if(randomNumber == 2) message.channel.send(`Do you want to get banned for swearing :thinking: ${message.member}`);
      if(randomNumber == 3) message.channel.send(`That's not very nice of you ${message.member}`);
      if(randomNumber == 4) message.channel.send(`You treat your supreme bot with respect ${message.member}!`);
      if(randomNumber == 5) message.channel.send(`:rolling_eyes: ${message.member}!`);
    }

    // Gay
    if(message.content.toLowerCase().includes("gay"))
    { 
      if(message.content.toLowerCase().includes("you are")
      || message.content.toLowerCase().includes("you")
      && message.content.toLowerCase().includes("re")
      || message.content.toLowerCase().includes("u r")
      || message.content.toLowerCase().includes("ur"))
      {
        let randomNumber = Math.floor(Math.random() * 3);
        if(randomNumber == 0) message.channel.send(`No you're gay ${message.member}`);
        if(randomNumber == 1) message.channel.send(`No you are ${message.member}`);
        if(randomNumber == 2) message.channel.send(`I'm only attracted to female bots ${message.member}`);
        if(randomNumber == 2) message.channel.send(`:kissing_smiling_eyes: ${message.member}`);
      }
    }

    // Stupid
    if(message.content.toLowerCase().includes("stupid"))
    { 
      if(message.content.toLowerCase().includes("you are")
      || message.content.toLowerCase().includes("you")
      && message.content.toLowerCase().includes("re")
      || message.content.toLowerCase().includes("u r")
      || message.content.toLowerCase().includes("ur")) {
        let randomNumber = Math.floor(Math.random() * 3);
        if(randomNumber == 0) message.channel.send(`No you are ${message.member}`);
        if(randomNumber == 1) message.channel.send(`I'm not the one calling an inanimate bot stupid ${message.member}`);
        if(randomNumber == 2) message.channel.send(`I can beat you at #blackjack and #roulette. I'm the smart one ${message.member}`);
      }
    }

    // Shut up
    if(message.content.toLowerCase().includes("shut up")
    || message.content.toLowerCase().includes("shutup"))
    { 
      let randomNumber = Math.floor(Math.random() * 3);
      if(randomNumber == 0) message.channel.send(`You shut up ${message.member}`);
      if(randomNumber == 1) message.channel.send(`I'll shut up when I want to ${message.member}`);
      if(randomNumber == 2) message.channel.send(`I'll shut up when you shut up ${message.member}`);
    }



  }
});





bot.login(token);