const Discord = require("discord.js");
const fs = require("fs");
let bank = JSON.parse(fs.readFileSync("./bank.json", "utf8"));
let blackjack = JSON.parse(fs.readFileSync("./blackjack.json", "utf8"));

module.exports.run = async (bot, message, args) => {
    try {
        if(message.channel.name == "blackjack") {
    
            let selectedMember = message.member;
    
            // get member's money from JSON, if new user, add user with $0
            if(!bank[selectedMember.id]) 
                bank[selectedMember.id] = {
                    money: 0
                };
    
            fs.writeFile("./bank.json", JSON.stringify(bank), (err) => {
                if(err) log(err);
            });
    
            memberFunds = bank[selectedMember.id].money;
    
            // no money
            if(memberFunds == 0) {
                return message.reply("You have 0 funds, please ask for more by replying with:\n\t!add money\n to add $1000 to your account");
            }
            
            let suits = ["hearts", "diamonds", "spades", "clubs"];
            
            // start new game
            if(args[0].toLowerCase() === "new" && args[1].toLowerCase() === "game") {
    
                // if user has enough to make that bet
                let bet = message.content.split(" bet ")[1];
                if(bet == undefined) {
                    return message.reply(`Please place a bet. You have $${memberFunds}`);
                }
                if(bet > memberFunds) {
                    return message.reply(`You don't have the money for that bet. You only have $${memberFunds}`);
                }
    
                // get member's money from JSON, if new user, add user with $0
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
                if(!blackjack[selectedMember.id].dealerSuits == []) 
                {
                    return playerTurn("true");
                }
                return message.reply("You have to start a new game first by saying:\n!blackjack new game");
            }
            else if(args[0].toLowerCase() === "stand") {
                if(!blackjack[selectedMember.id].dealerSuits == []) 
                {
                    return dealerTurn("true");
                }
                return message.reply("You have to start a new game first by saying:\n!blackjack new game");
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
    
                    if(playerCards[i] == "A" && playerTotal > 21) {
                        playerTotal -= 10;
                        blackjack[selectedMember.id].playerAces--;
                    }
    
                    playerCardsText += playerCards[i] + ":" + playerSuits[i] + ": ";
                }
    
                // dealer card
                for(let i = 0; i < 1; i++) {
                    dealerCardsText += dealerCards[i] + ":" + dealerSuits[i] + ": ";
                    dealerTotal = cardToNumber(dealerCards[i]);
                }
                
                if(playerTotal > 21) {
                    bust = "**Bust**";
                }
    
                if(!bust.includes("Bust") || playerTotal != 21) {
                    return message.reply(`\n:slot_machine: Bet: **${bet}**\n\tDealer: **${dealerCardsText}**\tTotal: ${dealerTotal}\n\tPlayer:**${playerCardsText}**\tTotal: ${playerTotal} \t${bust}`);
                }
    
                newDealerCard();
                
                // dealer card
                for(let i = 0; i < playerCards.length; i++) {
                    dealerCardsText += dealerCards[i] + ":" + dealerSuits[i] + ": ";
                    dealerTotal = cardToNumber(dealerCards[i]);
                }
                
                return message.reply(`\n:slot_machine: Bet: **${bet}**\n\tDealer: **${dealerCardsText}**\tTotal: ${dealerTotal}\n\tPlayer:**${playerCardsText}**\tTotal: ${playerTotal} \t${bust}`);
                
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
    
                console.log(blackjack[selectedMember.id]);
                
    
                fs.truncate("./blackjack.json", 0, (err) => {
                    if(err) log(err);
                });
        
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
        
                        if(playerCards[i] == "A" && playerTotal > 21) {
                            playerTotal -= 10;
                            blackjack[selectedMember.id].playerAces--;
                        }
        
                        playerCardsText += playerCards[i] + ":" + playerSuits[i] + ": ";
                    }
        
                    // dealer card
                    for(let i = 0; i < dealerCards[i]; i++) {
                        dealerTotal += cardToNumber(dealerCards[i]);
        
                        if(dealerCards[i] == "A" && dealTotal > 21) {
                            dealerTotal -= 10;
                            blackjack[selectedMember.id].dealerAces--;
                        }
                       dealerCardsText += dealerCards[i] + ":" + dealerSuits[i] + ": ";
                       console.log(dealerCardsText);
                       
                    }
                    
                    if(dealerTotal > 21) {
                        bust = "**Bust**";
                    }
        
                    if(!bust.includes("Bust")) {
                        message.reply(`\n:slot_machine: Bet: **${bet}**\n\tDealer: **${dealerCardsText}**\tTotal: ${dealerTotal}\n\t${bust}\n\tPlayer:**${playerCardsText}**\tTotal: ${playerTotal}`);
                    }
                    
                } while(dealerTotal < 17 && blackjack[selectedMember.id].dealerAces == 0)
                
                return message.reply(`\n:slot_machine: Bet: **${bet}**\n\tDealer: **${dealerCardsText}**\tTotal: ${dealerTotal}\n\tPlayer:**${playerCardsText}**\tTotal: ${playerTotal}`);
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
    
                fs.truncate("./blackjack.json", 0, (err) => {
                    if(err) log(err);
                });
        
                fs.writeFile("./blackjack.json", JSON.stringify(blackjack), (err) => {
                    if(err) log(err);
                });
            }
    
            function numberToCard(number) {
                let card = number;
                if(number == 11) {
                    card = "J";
                }
                else if(number == 12) {
                    card = "J";
                }
                else if(number == 13) {
                    card = "Q";
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