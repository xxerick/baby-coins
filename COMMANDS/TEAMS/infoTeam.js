/////* || [INITIALIZATION] || */////
const LOGGER = require("../../INITIALIZATION/logger")
const CONFIG = require("../../INITIALIZATION/config.js")
const DATABASE = require("../../INITIALIZATION/db.js")
const DISCORD = require("discord.js");

/////* || [ACTIONS] || */////
module.exports.run = async(CLIENT, message, ARGS, PREFIXARRAY) => {

    ///* || [CHECK USER IN DB] || *///

    let embed = new DISCORD.MessageEmbed();
            DATABASE.DB.query("SELECT * FROM teams", async function(err, rows){
                if(err) LOGGER.error(err);
                let target = message.author.id;
                if(message.mentions.members.first()) target = message.mentions.members.first().user.id;
                console.log(target)
                isTeam = false
                let rID;
                if(rows.length < 1) {isTeam = false} else {
                    for(var i = 0; i < rows.length; i++){
                        let mJson = JSON.parse(rows[i].team_members).members;
                        
                        mJson.forEach(value => {if(value == target){isTeam = true; rID = i;}})
                    }
                
                    if(isTeam == false) return message.channel.send(`<@${target}>, pas de team!`)

                    let team_name = rows[rID].team_name;
                    let team_chief = rows[rID].team_chief_id;
                    let team_role = rows[rID].team_role_id;
                    let team_text = rows[rID].team_text_id;
                    let team_members = JSON.parse(rows[rID].team_members).members;
                    let team_id = rows[rID].team_id;
                    let team_experience = (rows[rID].team_experience).toFixed(2);

                    let mString = "";
                    team_members.forEach(member => {
                        mString += `<@${member}>\n`
                    })
                    embed.setColor(`#2F3136`)
                    embed.setDescription(`
                    **Nom:** ${team_name}\n
                    **Chef:** <@${team_chief}>\n
                    **Role:** <@&${team_role}>\n
                    **Salon Textuel:** <#${team_text}>\n
                    **Point d'expérience:** ${team_experience}\n\n
                    **Membres:**\n ${mString}
                    `)

                    message.channel.send(embed)
                }
            })
            
}



module.exports.config = {
    category: "Team",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["info"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour inviter quelqu'un dans votre team",
    utilisations: `.info`,
    exemples: `.info`
}