/////* || [INITIALIZATION] || */////
const LOGGER = require("../../INITIALIZATION/logger")
const CONFIG = require("../../INITIALIZATION/config.js")
const DATABASE = require("../../INITIALIZATION/db.js")
const DISCORD = require("discord.js");
const { user } = require("../..");

/////* || [ACTIONS] || */////
module.exports.run = async(CLIENT, message, ARGS, PREFIXARRAY) => {

    ///* || [VARIALBES] || *///
    let argent = ARGS[0];
    let target = message.mentions.members.first();

    ///* || [CHECK VALUE / TARGET] || *///
    if(isFloat(argent) == false) return message.channel.send(`**${message.author.tag}**, veuillez entrer une valeur valide !`); argent = parseFloat(argent);
    if(argent < 25.00) return message.channel.send(`**${message.author.tag}**, le montant minimum pour une transaction est de **25.00** fraises !`);
    if(!target) return message.channel.send(`**${message.author.tag}**, veuillez mentionnez le destinataire !`);
    if(target.user.bot) return message.channel.send(`**${message.author.tag}**, je ne peux pas envoyer d'fraises à un robot.. `);

    ///* || [CHECK USER / TARGET IN DB] || *///
    DATABASE.CheckUserInDB(message.author.id); DATABASE.CheckUserInDB(target.user.id);

     ///* || [CHECK USER COINS IN DB] || *///
    DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", message.author.id, function(err, rows){
        if(err) LOGGER.error(err);

    //* || [VARIABLE] || *//
        let userCoins;
        let targetCoins;
        let userFinalCoins;
        let targetFinalCoins;

        if(rows.length < 1) {DATABASE.CheckUserInDB(message.author.id); userCoins = 0;} else {
            userCoins = parseFloat(rows[0].user_coins);
        }

        if(userCoins < argent) return message.channel.send(`**${message.author.tag}**, vous n'avez pas assez d'fraises...`);

        DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", target.user.id, function(err, rowss){
            if(err) LOGGER.error(err);
            if(rowss.length < 1 ){DATABASE.CheckUserInDB(target.user.id); targetCoins = "none"} else {

                targetCoins = parseFloat(rowss[0].user_coins);
            }

            if(targetCoins == "none") return message.channel.send(`**${message.author.tag}**, le destinataire n'as pas de compte..`)
             userFinalCoins = parseFloat(userCoins - argent);
             targetFinalCoins = targetCoins + argent;

                DATABASE.DB.query("UPDATE coins SET user_coins = ? WHERE user_id = ?", [userFinalCoins, message.author.id]);
                DATABASE.DB.query("UPDATE coins SET user_coins = ? WHERE user_id = ?", [targetFinalCoins, target.user.id]);
        })

        message.channel.send(`**${message.author.tag}**, la transaction de **${argent}** fraises à été effectué.`)

    })

}



module.exports.config = {
    category: "Banque",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["pay"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour envoyer de l'coins à vos proches.",
    utilisations: `.virement`,
    exemples: `.virement 300.00 @Target`
}

function isFloat(val) {
    var floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
    if (!floatRegex.test(val))
        return false;

    val = parseFloat(val);
    if (isNaN(val))
        return false;
    return true;
}