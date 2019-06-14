const Discord = require("discord.js");
const fs = require("fs");
let bank = JSON.parse(fs.readFileSync("./bank.json", "utf8"));
let blackjack = JSON.parse(fs.readFileSync("./blackjack.json", "utf8"));

module.exports.run = async (bot, message, args) => {
    try {
        if(message.channel.name == "blackjack") {
    
            let selectedMember = message.member;
    
            // get member's money from JSON, if new user, add user with $0
            if(!bank[selectedMember.id]) {
                bank[selectedMember.id] = {
                    money: 0
                };
    
                fs.writeFile("./bank.json", JSON.stringify(bank), (err) => {
                    if(err) log(err);
                });
            }
    
            memberFunds = bank[selectedMember.id].money;
    
            // no money
            console.log(memberFunds);
            
            if(memberFunds == 0) {
                return message.reply("You have 0 funds, please ask for more by replying with:\n\t!addmoney\n to add $1000 to your account");
            }
            
            let suits = ["hearts", "diamonds", "spades", "clubs"];
            
            // start new game
            if(args[0].toLowerCase() === "new" && args[1].toLowerCase() === "game") {
    
                // if user has enough to make that bet
                let bet = message.content.split(" bet ")[1];
                if(bet == undefined) {
                    return message.reply(`Please place a bet by typing:\n\t!blackjack new game bet [bet amount]\nYou have $${memberFunds}`);
                }
                if(bet > memberFunds) {
                    return message.reply(`You don't have the money for that bet. You only have $${memberFunds}`);
                }
    
                // set new game
                blackjack[selectedMember.id] = {
                    dealerSuits: [],
                    dealerCards: [],
                    playerSuits: [],
                    playerCards: [],
                    dealerAces: 0,
                    playerAces: 0,
                    betAmount: 0
                };
                fs.truncate("./blackjack.json", 0, (err) => {
                    if(err) log(err);
                });
                fs.writeFile("./blackjack.json", JSON.stringify(blackjack), (err) => {
                    if(err) log(err);
                });
                
                blackjack[selectedMember.id].betAmount = bet;
    
                playerTurn("false");
            }
            else if(args[0].toLowerCase() === "hit") {
                if(blackjack[selectedMember.id].playerCards.length != 0) 
                {
                    return playerTurn("true");
                }
                return message.reply("You have to start a new game first by saying:\n\t!blackjack new game bet [bet amount]");
            }

            else if(args[0].toLowerCase() === "stand") {
                if(blackjack[selectedMember.id].playerCards.length != 0) 
                {
                    return dealerTurn("true");
                }
                return message.reply("You have to start a new game first by saying:\n\t!blackjack new game bet [bet amount]");
            }

            else if(args[0].toLowerCase().includes("double")) {
                if(blackjack[selectedMember.id].playerCards.length != 0) 
                {
                    return playerTurn("double");
                }
                return message.reply("You have to start a new game first by saying:\n\t!blackjack new game bet [bet amount]");
            }

            else {
                return message.reply("Incorrect blackjack call");
            }
    
            function playerTurn(hit) {
                
                newPlayerCard();
                if(hit == "false")  {
                    newPlayerCard();
                    dealerTurn("false");
                }
    
                let bust = "";
                let dealerSuits = blackjack[selectedMember.id].dealerSuits;
                let dealerCards = blackjack[selectedMember.id].dealerCards;
                let playerSuits = blackjack[selectedMember.id].playerSuits;
                let playerCards = blackjack[selectedMember.id].playerCards;
                let playerCardsText = "";
                let dealerCardsText = "";
                let playerTotal = 0;
                let dealerTotal = 0;
                let bet = blackjack[selectedMember.id].betAmount;
    
                // player cards
                for(let i = 0; i < playerCards.length; i++) {
                    let number = cardToNumber(playerCards[i]);
                    playerTotal += number;
    
                    playerCardsText += playerCards[i] + ":" + playerSuits[i] + ": ";
                }
                let aces = blackjack[selectedMember.id].playerAces;
                while(aces > 0 && playerTotal > 21) {
                    playerTotal -= 10;
                }
    
                // dealer card
                for(let i = 0; i < 1; i++) {
                    dealerCardsText += dealerCards[i] + ":" + dealerSuits[i] + ": ";
                    dealerTotal = cardToNumber(dealerCards[i]);
                }
                
                if(playerTotal > 21) {
                    bust = "**Bust**";
                }
                if(playerTotal == 21) {
                    if(hit == "false") {
                        bust = "**Blackjack!**";
                    }
                    else {
                        bust = "**21!**";
                    }
                }
                
                if(!bust.includes("Bust") && playerTotal != 21 && hit != "double") {
                    return message.reply(`\n:slot_machine: Bet: **${bet}**\n\tDealer: **${dealerCardsText}**\tTotal: ${dealerTotal}\n\tPlayer:**${playerCardsText}**\tTotal: ${playerTotal} \t${bust}`);
                }

                let text = `\n:slot_machine: Bet: **${bet}**\n\tDealer: **${dealerCardsText}**\tTotal: ${dealerTotal}\n\tPlayer:**${playerCardsText}**\tTotal: ${playerTotal} \t${bust}`;
                if(hit == "double") {
                    
                    blackjack[selectedMember.id].betAmount = blackjack[selectedMember.id].betAmount*2;
                    bet = blackjack[selectedMember.id].betAmount;

                    fs.writeFile("./blackjack.json", JSON.stringify(blackjack), (err) => {
                        if(err) log(err);
                    });

                    message.reply(text);

                    if(hit == "double" && playerTotal <= 21) {
                        return dealerTurn("true");
                    }
                }
                if(playerTotal == 21 && !bust.toLowerCase().includes("blackjack")) {
                    return dealerTurn("true");
                }
                newDealerCard();
                dealerCardsText = "";
                dealerTotal = 0;
                // dealer card
                for(let i = 0; i < dealerCards.length; i++) {
                    dealerCardsText += dealerCards[i] + ":" + dealerSuits[i] + ": ";
                    dealerTotal += cardToNumber(dealerCards[i]);
                }
                text = `\n:slot_machine: Bet: **${bet}**\n\tDealer: **${dealerCardsText}**\tTotal: ${dealerTotal}\n\tPlayer:**${playerCardsText}**\tTotal: ${playerTotal} \t${bust}`;
                if(playerTotal > 21) {
                    return gameOver(text, "loss");
                }
                else if(bust.toLowerCase.includes("blackjack")) {
                    return gameOver(text, "blackjack");
                }
                
                return message.reply(text);
                
            }
    
            function newPlayerCard() {
                let playerSuits = blackjack[selectedMember.id].playerSuits;
                let playerCards = blackjack[selectedMember.id].playerCards;
    
                let card = Math.floor(Math.random() * 13) + 2;
                let suit = Math.floor(Math.random() * 4);
                card = numberToCard(card);
                    
                if(card == "A") {
                    blackjack[selectedMember.id].playerAces++;
                }
    
                playerSuits[playerSuits.length] = suits[suit];
                playerCards[playerCards.length] = card;
    
                blackjack[selectedMember.id].playerSuits = playerSuits;
                blackjack[selectedMember.id].playerCards = playerCards;
        
                fs.writeFile("./blackjack.json", JSON.stringify(blackjack), (err) => {
                    if(err) log(err);
                });
                
            }
    
            function dealerTurn(endgame) {
                if(endgame == "false") {
                    return newDealerCard();
                }
                let dealerTotal = 0;
                let bet = blackjack[selectedMember.id].betAmount;
                let bust = "";
                let playerCardsText = "";
                let dealerCardsText = "";
                let playerTotal = 0;
    
                do {
                    newDealerCard();
    
                    let dealerSuits = blackjack[selectedMember.id].dealerSuits;
                    let dealerCards = blackjack[selectedMember.id].dealerCards;
                    let playerSuits = blackjack[selectedMember.id].playerSuits;
                    let playerCards = blackjack[selectedMember.id].playerCards;
                    playerCardsText = "";
                    dealerCardsText = "";
                    playerTotal = 0;
                    dealerTotal = 0;
        
                    // player cards
                    for(let i = 0; i < playerCards.length; i++) {
                        let number = cardToNumber(playerCards[i]);
                        playerTotal += number;
        
                        let aces = blackjack[selectedMember.id].playerAces;
                        while(aces > 0 && playerTotal > 21) {
                            playerTotal -= 10;
                        }
        
                        playerCardsText += playerCards[i] + ":" + playerSuits[i] + ": ";
                    }
        
                    // dealer card
                    for(let i = 0; i < dealerCards.length; i++) {
                        dealerTotal += cardToNumber(dealerCards[i]);
        
                        let aces = blackjack[selectedMember.id].dealerAces;
                        while(aces > 0 && dealerTotal > 21) {
                            dealerTotal -= 10;
                        }
                        dealerCardsText += dealerCards[i] + ":" + dealerSuits[i] + ": ";
                       
                    }
                    
                    if(dealerTotal > 21) {
                        bust = "**Bust**";
                    }
        
                    if(!dealerTotal < 17 && blackjack[selectedMember.id].dealerAces <= 0) {
                        
                        message.reply(`Dealer: **${dealerCardsText}**\tTotal: ${dealerTotal}`);
                    }
                    
                } while(dealerTotal < 17 && blackjack[selectedMember.id].dealerAces <= 0)
                
                let text = `\n:slot_machine: Bet: **${bet}**\n\tDealer: **${dealerCardsText}**\tTotal: ${dealerTotal}  ${bust}\n\n\tPlayer:**${playerCardsText}**\tTotal: ${playerTotal}`;
                if(dealerTotal > 21) {
                    return gameOver(text, "win");
                }
                else if(playerTotal > dealerTotal) {
                    return gameOver(text, "win");
                }
                else if(playerTotal < dealerTotal) {
                    return gameOver(text, "loss");
                }
                else {
                    return gameOver(text, "push");
                }
            }
    
            function newDealerCard() {
                let dealerSuits = blackjack[selectedMember.id].dealerSuits;
                let dealerCards = blackjack[selectedMember.id].dealerCards;
    
                let card = Math.floor(Math.random() * 13) + 2;
                let suit = Math.floor(Math.random() * 4);
                card = numberToCard(card);
                    
                if(card == "A") {
                    blackjack[selectedMember.id].dealerAces++;
                }
    
                dealerSuits[dealerSuits.length] = suits[suit];
                dealerCards[dealerCards.length] = card;
    
                blackjack[selectedMember.id].dealerSuits = dealerSuits;
                blackjack[selectedMember.id].dealerCards = dealerCards;

                fs.writeFile("./blackjack.json", JSON.stringify(blackjack), (err) => {
                    if(err) log(err);
                });
                
            }

            function gameOver(text, win) {
                let winText = text;
                let bet = blackjack[selectedMember.id].betAmount;

                if(win == "win") {
                    winText += `\nYou win! Winnings: **${bet}**`;
                    bank[selectedMember.id].money = +bet + +bank[selectedMember.id].money;
                }
                else if(win == "loss") {
                    winText += `\nDealer wins. Lost: **${bet}**`;
                    bank[selectedMember.id].money = +bank[selectedMember.id].money - +bet;
                }
                else if(win == "push") {
                    winText += `\nPush. You get your **$${bet}** back`;
                }
                else if(win == "blackjack") {
                    winText += `\nYou win! Winnings: **${bet*1.5}**`;
                    bank[selectedMember.id].money = (+bet*1.5) + +bank[selectedMember.id].money;
                }

                winText += `\nYour new balance is **$${bank[selectedMember.id].money}**`;

                // reset game
                blackjack[selectedMember.id] = {
                    dealerSuits: [],
                    dealerCards: [],
                    playerSuits: [],
                    playerCards: [],
                    dealerAces: 0,
                    playerAces: 0,
                    betAmount: 0
                };

                fs.writeFile("./blackjack.json", JSON.stringify(blackjack), (err) => {
                    if(err) log(err);
                });

                
                //console.log(bank);
                fs.writeFile("./bank.json", JSON.stringify(bank), (err) => {
                    if(err) log(err);
                });

                return message.reply(winText)
            }
    
            function numberToCard(number) {
                let card = number;
                if(number == 11) {
                    card = "J";
                }
                else if(number == 12) {
                    card = "Q";
                }
                else if(number == 13) {
                    card = "K";
                }
                else if(number == 14) {
                    card = "A";
                }
    
                return card;
            }
    
            function cardToNumber(card) {
                let number = card;
                if(card == "J") {
                    number = 10;
                }
                else if(card == "Q") {
                    number = 10;
                }
                else if(card == "K") {
                    number = 10;
                }
                else if(card == "A") {
                    number = 11;
                }
    
                return number;
            }
        }
    }
    catch (error) {
        console.log(error);
        
    }
}

module.exports.help = {
    name: "blackjack"
}