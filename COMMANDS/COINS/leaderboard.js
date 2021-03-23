/////* || [INITIALIZATION] || */////
const LOGGER = require("../../INITIALIZATION/logger")
const CONFIG = require("../../INITIALIZATION/config.js")
const DATABASE = require("../../INITIALIZATION/db.js")
const DISCORD = require("discord.js");

/////* || [ACTIONS] || */////
module.exports.run = async(CLIENT, message, ARGS, PREFIXARRAY) => {
    LOGGER.log("9")
    ///* || [GET TOP COINS] || *///
    DATABASE.DB.query("SELECT * FROM coins ORDER BY user_coins DESC LIMIT 10", async function(err, rows){
        if(err) LOGGER.error(err);
        if(rows.length < 1 ) {message.channel.send("...")} else {
            let embed = new DISCORD.MessageEmbed();
            for(var i = 0; i < rows.length; i++){
                let money = (rows[i].user_coins).toFixed(2);
                let user = await message.guild.members.resolve(rows[i].user_id);
                if(user) embed.addField(`${user.user.tag}`, `${money} \`fraises\``, false);
                embed.setTitle(`Leaderboard sur **${message.guild.name}**`)
                embed.setColor(`#2F3136`)
                
                
            }
            LOGGER.log("24")
            message.channel.send(embed);


        }
        
    })

}



module.exports.config = {
    category: "Banque",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["lb"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour voir les plus riches du serveur!",
    utilisations: `.leaderboard`,
    exemples: `.leaderboard`
}