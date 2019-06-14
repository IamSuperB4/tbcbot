const Discord = require("discord.js");
const fs = require("fs");
let bank = JSON.parse(fs.readFileSync("./bank.json", "utf8"));

module.exports.run = async (bot, message, args) => {
    
    if(message.channel.name == "roulette") {
    
        let selectedMember = message.member;

        //console.log(bank[selectedMember.id]);
        if(!bank[selectedMember.id]) {
            bank[selectedMember.id] = {
                money: 0
            };
        
           // console.log(bank);
            
            fs.writeFile("./bank.json", JSON.stringify(bank), (err) => {
                if(err) log(err);
            });
        }
            

        memberFunds = bank[selectedMember.id].money;

        if(memberFunds == 0) {
            return message.reply("You have 0 funds, please ask for more by replying with:\n\t!addmoney\n to add $1000 to your account");
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
            if(randomNumber == -1) randomNumber = 0;
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
            else if(randomNumber%2 == 0 && allBets[i].toLowerCase() == "even"
            && randomNumber > 0) {
                win[i] = "Wins ";
                winAmount[i] = bets * 1;
            }
            else if(randomNumber%2 == 1 && allBets[i].toLowerCase() == "odd"
            && randomNumber > 0){
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

        let winLossText = "Winnings";
        if(totalWins < 0) {
            winLossText = "Losses";
        }
        
        bank[selectedMember.id].money = memberFunds;

        
        //console.log(bank);

        fs.writeFile("./bank.json", JSON.stringify(bank), (err) => {
            if(err) log(err);
        });


        let allBetsText = "";
        for(let i = 0; i < allBets.length - 1; i++) {
            allBetsText += "**" + allBets[i] + "** " + win[i] + "$" + winAmount[i] + "\n";
        }
        allBetsText += "**" + allBets[allBets.length - 1] + "** " + win[win.length - 1] + "$" + winAmount[winAmount.length - 1];

        return message.reply(`\n:slot_machine: Bet: **${bet}**\n\tRoll: **${color} ${randomNumber}**\n${allBetsText}\n\t**Total ${winLossText}**: $${totalWins}\n\tYou're new balance is **$${memberFunds}**`);

    }
}

module.exports.help = {
    name: "roulette"
}