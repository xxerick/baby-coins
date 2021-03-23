/////* || [INITIALIZATION] || */////
const LOGGER = require("../../INITIALIZATION/logger")
const CONFIG = require("../../INITIALIZATION/config.js")
const DATABASE = require("../../INITIALIZATION/db.js")
const DISCORD = require("discord.js");

/////* || [ACTIONS] || */////
module.exports.run = async(CLIENT, message, ARGS, PREFIXARRAY) => {

    ///* || [CHECK USER IN DB] || *///
    DATABASE.DB.query("SELECT * FROM teams WHERE team_chief_id = ?", message.author.id, function(err, rows){
        if(err) LOGGER.error(err);
        if(rows.length < 1) {return message.channel.send(`**${message.author.tag}**, vous n'avez pas de team / permissions pour expulser un membre...`)} else {
            let team_members = JSON.parse(rows[0].team_members);
            let team_role = rows[0].team_role_id; 
            let team_text = rows[0].team_text_id;
            let team_name = rows[0].team_name;

            let target = message.mentions.members.first(); if(!target) return message.channel.send(`**${message.author.tag}**, vous devez mentionnez la personne à expulser...`)
            if(target.user.id == message.author.id) return message.channel.send(`**${message.author.tag}**, vous ne pouvez pas vous expluser..`)
            if(!team_role) return message.channel.send(`**${message.author.tag}**, impossible d'expulser cet utilisateur à votre team: ERREUR INCONNU...`)
            if(!team_text) return message.channel.send(`**${message.author.tag}**, impossible d'expulser cet utilisateur à votre team: ERREUR INCONNU...`)
            if(!team_name) return message.channel.send(`**${message.author.tag}**, impossible d'expulser cet utilisateur à votre team: ERREUR INCONNU...`)

            DATABASE.DB.query("SELECT * FROM teams", async function(err, rows){
                if(err) LOGGER.error(err);
                isTeam = false
                if(rows.length < 1) {isTeam = false} else {
                    for(var i = 0; i < rows.length; i++){
                        let mJson = JSON.parse(rows[i].team_members).members;
            
                        mJson.forEach(value => {if(value == target.user.id) isTeam = true;})
                    }
                    
                    if(isTeam == false) return message.channel.send(`<@${target.user.id}>, n'est pas dans votre team!`)

                    await target.send(new DISCORD.MessageEmbed()
                        .setTitle(`Vous avez été __explusé__ de la team: **${team_name}** sur **${message.guild.name}**`)
                        .setColor(`#2F3136`)
                    )
                    CLIENT.channels.resolve(team_text).send(`<@${target.user.id}> a été expulsé de la team!`)
                    CLIENT.guilds.resolve(CONFIG.MAINGUILD).members.resolve(target.user.id).roles.remove(team_role);

                    const index = team_members.members.indexOf(target.user.id);
                    if (index > -1) {
                        team_members.members.splice(index, 1);
                    }

                    DATABASE.DB.query("UPDATE teams SET team_members = ? WHERE team_chief_id = ?", [JSON.stringify(team_members), message.author.id]);

                }
            })
            
        }
    })



}


module.exports.config = {
    category: "Team",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["kick"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour expulser quelqu'un dans votre team",
    utilisations: `.kick`,
    exemples: `.kick`
}