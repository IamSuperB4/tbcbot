const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    if(message.channel.name == "roulette") {
        return message.reply(`**Bot commands**: if you **ping the bot**, it will respond to:
            Hello in 10 different languages and almost any common English way to say hello
            Say bye/goodbye to it
            Asking how it's day is going
            Ask for your lucky number
            Ask if you will win anything
            Tell TBC bot you love it
            Ask if it likes you
            Ask what the best clan is
            Ask who the best leader is
            Congratulate or thank it
            
            Favorites
            Ask for an 8 ball reading (must have the word "8 ball" in the message)
            Ask for a dog or cat picture
            Insults
            
            More responses coming soon. Please ask for anything you would like it to respond to or issues with the current setup`);
    }
    else if(message.channel.name == "roulette") {
        return message.reply(`**How to use the Bank**
            Add $1000 to your account (only works when you have $0 left):
                \t!addmoney
            
            Check your balance:
                \t!balance
            
            
            **How to play Roulette**
                \t!roulette bet [amount] on [bet 1], [bet 2],...
            
            **Types of Bets**
                \tColor: Red, black, green (0s)
                \tNumber: 0-36
                \tOdd/even
                \tRange: 1-18, 19-36
                \t12 range: First 12, 2nd 12, third 12
            
            **Examples**
                \t!roulette bet 100 on red
                \t!roulette bet 500 on 0, 1, 2, 3, 4, 5, 6, 7, 8
                \t!roulette bet 1000 on black, odd, 1, 1-18, first 12
            
            If you've never played roulette, here's how to play
            https://www.roulettesites.org/rules/
            
            Good luck and have fun! :four_leaf_clover:`);
    }
    else if(message.channel.name == "roulette") {
        return message.reply(`**How to use the Bank**
        Add $1000 to your account (only works when you have $0 left):
            \t!addmoney
        
        Check your balance:
            \t!balance
        
        
        **How to play Blackjack**
        New game:
            \t!blackjack new game bet [amount]
        
        Hit:
            \t!blackjack hit
        Stand:
            \t!blackjack stand
        Double down:
            \t!blackjack double
        
        If you've never played blackjack, here's how to play:
        https://www.blackjackapprenticeship.com/how-to-play-blackjack/
        
        Good luck and have fun! :four_leaf_clover:`);
    }
    else {
        return message.reply(`You can't use the bot in this channel. Go to #bot-chatter, #roulette, or #blackjack`);
    }
}

module.exports.help = {
    name: "help"
}