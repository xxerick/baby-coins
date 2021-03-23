/////* || [INITIALIZATION] || */////
const LOGGER = require("../../INITIALIZATION/logger")
const CONFIG = require("../../INITIALIZATION/config.js")
const DATABASE = require("../../INITIALIZATION/db.js")
const DISCORD = require("discord.js");

/////* || [ACTIONS] || */////
module.exports.run = async(CLIENT, message, ARGS, PREFIXARRAY) => {

    ///* || [CHECK USER IN DB] || *///
    DATABASE.CheckUserInDB(message.author.id);

    ///* || [GET USER COINS] || *///
    DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", message.author.id, function(err, rows){
        if(err) LOGGER.error(err);
        if(rows.length < 1){
            DATABASE.CheckUserInDB(message.author.id);
            message.channel.send(`**${message.author.tag}**, vous avez **0.00** fraises.`)
        } else {
            let userFixedCoins = parseFloat(rows[0].user_coins).toFixed(2);
            message.channel.send(`**${message.author.tag}**, vous avez **${userFixedCoins}** fraises.`)
        }
    })

}



module.exports.config = {
    category: "Banque",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["fraises"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour acceder à votre portefeuille",
    utilisations: `.fraises`,
    exemples: `.fraises`
}