const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    if(message.channel.name == "roulette") {
        return message.reply(`**Bot commands**: if you **ping the bot**, it will respond to:\n
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
            Insults\n
            \n
            More responses coming soon. Please ask for anything you would like it to respond to or issues with the current setup`);
    }
    else if(message.channel.name == "roulette") {
        return message.reply(`**How to use the Bank**\n
            Add $1000 to your account (only works when you have $0 left):\n
                \t!addmoney\n
            \n
            Check your balance:\n
                \t!balance\n
            \n
            \n
            **How to play Roulette**\n
                \t!roulette bet [amount] on [bet 1], [bet 2],...\n
            \n
            **Types of Bets**\n
                \tColor: Red, black, green (0s)\n
                \tNumber: 0-36\n
                \tOdd/even\n
                \tRange: 1-18, 19-36\n
                \t12 range: First 12, 2nd 12, third 12\n
            \n
            **Examples**\n
                \t!roulette bet 100 on red\n
                \t!roulette bet 500 on 0, 1, 2, 3, 4, 5, 6, 7, 8\n
                \t!roulette bet 1000 on black, odd, 1, 1-18, first 12\n
            \n
            If you've never played roulette, here's how to play\n
            https://www.roulettesites.org/rules/\n
            \n
            Good luck and have fun! :four_leaf_clover:`);
    }
    else if(message.channel.name == "roulette") {
        return message.reply(`**How to use the Bank**\n
        Add $1000 to your account (only works when you have $0 left):\n
            \t!addmoney\n
        \n
        Check your balance:\n
            \t!balance\n
        \n
        \n
        **How to play Blackjack**\n
        New game:\n
            \t!blackjack new game bet [amount]\n
        \n
        Hit:\n
            \t!blackjack hit\n
        Stand:\n
            \t!blackjack stand\n
        Double down:\n
            \t!blackjack double\n
        \n
        If you've never played blackjack, here's how to play:\n
        https://www.blackjackapprenticeship.com/how-to-play-blackjack/\n
        \n
        Good luck and have fun! :four_leaf_clover:`);
    }
    else {
        return message.reply(`You can't use the bot in this channel. Go to #bot-chatter, #roulette, or #blackjack`);
    }
}

module.exports.help = {
    name: "help"
}