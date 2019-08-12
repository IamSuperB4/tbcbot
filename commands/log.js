const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    let bank = JSON.parse(fs.readFileSync("./keylog.csv", "utf8"));
    
    if(message.channel.name == "roulette" || message.channel.name == "blackjack") {

        let selectedMember = message.member;

        try {
            console.log(`Bal: ${bank[selectedMember.id].money}`);
        } catch (error) {
            console.log("ran");
            
            bank[selectedMember.id] = {
                money: 0
            };

            fs.writeFile("./bank.json", JSON.stringify(bank), (err) => {
                if(err) log(err);
            });
        }

        console.log(`Bal Before: ${bank[selectedMember.id].money}`);
        memberFunds = bank[selectedMember.id].money;
        console.log(`Bal After: ${bank[selectedMember.id].money}`);
        
        
        return message.reply(`You have $${memberFunds}`);
    }
}

module.exports.help = {
    name: "log"
}