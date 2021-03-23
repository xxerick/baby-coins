/////* || [INITIALIZATION] || */////
const LOGGER = require("../INITIALIZATION/logger.js")
const CONFIG = require("../INITIALIZATION/config.js")
const DATABASE = require("../INITIALIZATION/db.js")
const DISCORD = require("discord.js");
const CHANCE = require("chance");
const { arch } = require("os");

var coinsTimeout = {};


/////* || [ACTIONS] || */////
module.exports = async(CLIENT, message) => {
     
    ///* || [BLOCK DM | BOT] || *///
    if (message.guild == null && message.author.bot == false) {return;}
    if (message.author.bot) return;

    DATABASE.DB.query("SELECT * FROM teams", async function(err, rows){
        if(err) LOGGER.error(err);
        let target = message.author.id;
        isTeam = false
        let rID;
        if(rows.length < 1) {isTeam = false} else {
            for(var i = 0; i < rows.length; i++){
                let mJson = JSON.parse(rows[i].team_members).members;
    
                mJson.forEach(value => {if(value == target){isTeam = true; rID = i;}})
            }
        
            if(isTeam == false) return;
            let team_experience = rows[rID].team_experience;
            let team_chief = rows[rID].team_chief_id;
            let newExperience = (Math.random() * (0.564 - 0.132) + 0.132);
            let finalExperience = parseFloat(team_experience + newExperience);
            DATABASE.DB.query("UPDATE teams SET team_experience = ? WHERE team_chief_id = ?", [finalExperience, team_chief])

        }
    })
    ///* || [COINS SET IN DATATBASE] || *///
    if(coinsTimeout[message.author.id] == true){} else {
        coinsTimeout[message.author.id] = true;
        DATABASE.CheckUserInDB(message.author.id);
        DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", message.author.id, function(err, rows){
        if(err) LOGGER.error(err);
        if(rows.length < 1) {DATABASE.CheckUserInDB(message.author.id)} else {
            let currentMoney = rows[0].user_coins;
            let newMoney = (Math.random() * (0.980 - 0.180) + 0.180);
            let finalCoins = parseFloat(currentMoney + newMoney);

            DATABASE.DB.query("UPDATE coins SET user_coins = ? WHERE user_id = ?", [finalCoins, message.author.id])
        }
    })
        setTimeout(() => {
            coinsTimeout[message.author.id] = false;
        }, 10000)
    }

    var customPrefix = "/";
  
    ///* || [IF SOMEONE PING THE BOT] || *///
    if (message.content == `<@!${CLIENT.user.id}>` || message.content == `<@!${CLIENT.user.id}> `) {
        if (message.author.bot) return;
        message.channel.send(`<:778353230484471819:780727288903237663> Mon prefix est: \`.\``)
            }

    ///* || [PREFIX] || *///
    const PREFIXARRAY = [customPrefix, `<@!${CLIENT.user.id}>`, `<@!${CLIENT.user.id}> `];
    let prefix = false; for (const thisPrefix of PREFIXARRAY) {if (message.content.startsWith(thisPrefix)) prefix = thisPrefix;};
    const ARGS = message.content.slice(prefix.length).trim().split(/ +/g);
    const COMMAND = ARGS.shift().toLowerCase();
    let cmd = CLIENT.COMMANDS.get(COMMAND) || CLIENT.COMMANDS.get(CLIENT.ALIASES.get(COMMAND));

    if (cmd && prefix != false) {
        if (!CONFIG.OWNERS.includes(message.author.id)) {
            if (cmd.config.category == "owner") {
                message.channel.send("You are not authorized..");
                return;
            }
        } else {
            if (message.guild) {
                
            } else {
                if (cmd.config.serverForced) {
                    message.channel.send("This command is GuildOnly.");
                    return;
                }
            }
            
            return cmd.run(CLIENT, message, ARGS).catch(warning => {
                let embed = new DISCORD.MessageEmbed();
                embed.setDescription("An error occurred with the command : **" + cmd.config.name + "**.");
                embed.addField('Error :', warning.name);
                embed.setFooter(CLIENT.user.username, CLIENT.user.avatarURL());
                embed.setTimestamp();
                embed.setColor("#2F3136");
                message.channel.send(embed);
                LOGGER.error(`Error occured with the command ${cmd.config.name} in ${message.guild.name} | Reason: ${warning.stack}`)
            });
        }

        if (message.guild) {
            if (cmd.config.category == "modération" && !message.member.permissions.has("KICK_MEMBERS", true)) {
                // Non modérateur.
                message.channel.send("Vous n'êtes pas modérateur sur le serveur donc vous n'avez pas le droit d'utiliser cette commande.");
                return;
            }

            if (cmd.config.category == "Configuration" && !message.member.permissions.has("ADMINISTRATOR", true)) {
                // Non administrateur.
                message.channel.send("Vous n'êtes pas adminsitrateur sur le serveur donc vous n'avez pas le droit d'utiliser cette commande.");
                return;
            }
        }
       
        else {
            if (cmd.config.serverForced) {
                // Pour les commandes uniquement disponibles sur serveur.
                message.channel.send("La commande est uniquement disponible sur un serveur.");
                return;
            }
        }

        return (cmd.run(CLIENT, message, ARGS, PREFIXARRAY)).catch(warning => {
            // Vous pouvez envoyer l'erreur dans un salon.
            message.channel.send("Une erreur a eu lieu avec cette commande, le créateur a été avertit de ceci.");
        });
    }
    
    
};