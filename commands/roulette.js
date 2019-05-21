const Discord = require("discord.js");
const fs = require("fs");
let bank = JSON.parse(fs.readFileSync("./bank.json", "utf8"));

module.exports.run = async (bot, message, args) => {
    
    if(message.channel.name == "roulette") {
    
        let selectedMember = message.member;

        if(!bank[selectedMember.id]) 
            bank[selectedMember.id] = {
                money: 0
            };

        fs.writeFile("./bank.json", JSON.stringify(bank), (err) => {
            if(err) log(err);
        });

        memberFunds = bank[selectedMember.id].money;
        
        if(message.content.split("!roulette ")[1].toLowerCase() === "add money") {
            if(memberFunds != 0) return message.reply(`You can only get more funds when you run out of money. You have $${memberFunds}`);
            else {
                bank[selectedMember.id].money = 1000;
                fs.writeFile("./bank.json", JSON.stringify(bank), (err) => {
                    if(err) log(err);
                });
                memberFunds = bank[selectedMember.id].money;
                return message.reply(`$1000 has been added to your account! You have $${memberFunds}`)
            }
        }
        else if(message.content.split("!roulette ")[1].toLowerCase() === "balance") {
            return message.reply(`You have $${memberFunds}`)
        }

        if(memberFunds == 0) {
            return message.reply("You have 0 funds, please ask for more by replying with:\n\t!roulette add money\n to add $1000 to your account");
        }

        let bet = args[1];
        if(bet > memberFunds) {
            return message.reply(`You don't have the money for that bet. You only have $${memberFunds}`);
        }

        let betOn = message.content.split(" on ")[1];
        let randomNumber = Math.floor(Math.random() * 38) - 1;
        let color = "Red";
        let win = betOn.split(", ");
        let winAmount = betOn.split(", ");
        let bets = Math.floor(bet/win.length);

        let allBets = betOn.split(", ");

        if(randomNumber == -1 || randomNumber == 0) {
            color = "Green";
        }
        else if(randomNumber > 0 && randomNumber < 11
        || randomNumber > 18 && randomNumber < 29) {
            if(randomNumber % 2 == 1) color = "Red";
            else color = "Black";
        }
        else {
            if(randomNumber % 2 == 0) color = "Red";
            else color = "Black";
        }

        for(let i = 0; i < allBets.length; i++) {
            if(allBets[i].includes("-")) {
                let range = allBets[i].split("-");
                if(range[0] == 1 && range[1] == 18
                || range[0] == 19 && range[1] == 36) {
                    if(randomNumber >= range[0] && randomNumber <= range[1]){
                        win[i] = "Wins ";
                        winAmount[i] = bets * 1;
                    }
                    else {
                        win[i] = "Loses "; 
                        winAmount[i] = bets;
                    }
                }
                else {
                    win[i] = "Invalid Range. Win $0"; 
                    winAmount[i] = bets;
                }
            }
            else if(allBets[i].toLowerCase().includes("first")
            || allBets[i].toLowerCase().includes("1st")) {
                if(randomNumber >= 1 && randomNumber <= 12){
                    win[i] = "Wins ";
                    winAmount[i] = bets * 2;
                }
                else {
                    win[i] = "Loses "; 
                    winAmount[i] = bets;
                }
            }
            else if(allBets[i].toLowerCase().includes("second")
            || allBets[i].toLowerCase().includes("2nd")) {
                if(randomNumber >= 13 && randomNumber <= 24){
                    win[i] = "Wins ";
                    winAmount[i] = bets * 2;
                }
                else {
                    win[i] = "Loses "; 
                    winAmount[i] = bets;
                }
            }
            else if(allBets[i].toLowerCase().includes("third")
            || allBets[i].toLowerCase().includes("3rd")) {
                if(randomNumber >= 25 && randomNumber <= 36){
                    win[i] = "Wins ";
                    winAmount[i] = bets * 2;
                }
                else {
                    win[i] = "Loses "; 
                    winAmount[i] = bets;
                }
            }
            else if(color.toLowerCase() === allBets[i]){
                win[i] = "Wins ";
                winAmount[i] = bets * 1;
            }
            else if(randomNumber % 2 == 0 && allBets[i].toLowerCase == "even"){
                win[i] = "Wins ";
                winAmount[i] = bets * 1;
            }
            else if(randomNumber % 2 == 1 && allBets[i].toLowerCase == "odd"){
                win[i] = "Wins ";
                winAmount[i] = bets * 1;
            }
            else if(randomNumber == allBets[i]
            || randomNumber == -1 && allBets[i] == 0){
                win[i] = "Wins ";
                winAmount[i] = bets * 34;
            }
            else {
                win[i] = "Loses ";
                winAmount[i] = bets;
            }
        }

        let totalWins = 0;
        for(let i = 0; i < allBets.length; i++) {
            if(win[i] == "Wins ") totalWins += winAmount[i];
            else if(win[i] == "Loses ") totalWins -= winAmount[i];
        }
        memberFunds += totalWins;
        
        bank[selectedMember.id].money = memberFunds;
        
        
        
        fs.truncate("./bank.json", 0, (err) => {
            if(err) log(err);
        });

        fs.writeFile("./bank.json", JSON.stringify(bank), (err) => {
            if(err) log(err);
        });


        let allBetsText = "";
        for(let i = 0; i < allBets.length - 1; i++) {
            allBetsText += "**" + allBets[i] + "** " + win[i] + "$" + winAmount[i] + "\n";
        }
        allBetsText += "**" + allBets[allBets.length - 1] + "** " + win[win.length - 1] + "$" + winAmount[winAmount.length - 1];

        return message.reply(`\n:slot_machine: Bet: **${bet}**\n\tRoll: **${color} ${randomNumber}**\n${allBetsText}\n\t**Total Winnings**: $${totalWins}\n\tYou're new balance is **$${memberFunds}**`);

    }


    


    

    /*
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
    */
}

module.exports.help = {
    name: "roulette"
}