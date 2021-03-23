/////* || [INITIALIZATION] || */////
const LOGGER = require("../../INITIALIZATION/logger")
const CONFIG = require("../../INITIALIZATION/config.js")
const DATABASE = require("../../INITIALIZATION/db.js")
const DISCORD = require("discord.js");
var price = 0.00;

/////* || [ACTIONS] || */////
module.exports.run = async(CLIENT, message, ARGS, PREFIXARRAY) => {

    
    ///* || [SEND EMBED] || *///
    let msg = await message.channel.send(new DISCORD.MessageEmbed()
    .setAuthor(`LA BOUTIQUE`, `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
    .setDescription("\nAprès un achat, aucun remboursement n'est possible. \n \n **Voici les arcticles:**")
    .setColor(`#2F3136`)
   // .addField("1 ・ Role personnalisable [ *10000* coins ]", "Grâce à votre role personnalisé, marquez vos distance avec les randoms !")
   // .addField("2 ・ Channel personnalisable [ *15000* coins ]", "Grâce à votre channel personnalisé, vous serez le maitre des lieux !")
    .addField("3 ・ Cration de team [ *15000* fraises ]", "Crée votre propre team, gerez la pour être le numéro 1 du serveur")
    )

       // msg.react("1️⃣");
    //    msg.react("2️⃣");
        msg.react("3️⃣");

    
    let collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);

        ///* || [CHECK USER IN DB] || *///

    ///* || [COLLECTOR] || *///
    collector.on("collect", async(reaction, user) => {
        DATABASE.CheckUserInDB(user.id);
        if(reaction._emoji.name === "1️⃣") {
            price = 10000.00;
            let authorCoins;
            let roleName = "";
            let roleColor = "";

            DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", user.id, function(err, rows){
                if(err) LOGGER.error(err);
                if(rows.length < 1){DATABASE.CheckUserInDB(user.id);} else {
                    authorCoins = rows[0].user_coins;
                }

                if(authorCoins < price) return message.channel.send(`**${user.tag}**, vous n'avez pas assez d'coins...`)

                DATABASE.DB.query("UPDATE coins SET user_coins = ? WHERE user_id = ?", [(authorCoins - price), user.id]);

                reaction.message.guild.channels.create(`Commande n${user.id}`, {type: "text", permissionOverwrites: [
                    {
                        id: reaction.message.guild.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: user.id,
                        allow: ['VIEW_CHANNEL'],
                    },
                ],}).then(async channel => {
                    reaction.message.channel.send(`Merci pour votre achat, cliquez sur ce salon pour finaliser votre commande **[<#${channel.id}>]**`)

                    channel.send(new DISCORD.MessageEmbed()
                    .setDescription(`Merci pour votre achat <@${user.id}>, veuillez configurer votre role ci-dessous`)
                    .setColor(`#2F3136`))

                    let roleName;
                    let roleColor;
                    const filter = m => m.author.id == message.author.id;
                    let s2 = await channel.send(new DISCORD.MessageEmbed()
                    .setTitle("**Entrez le nom que vous désirez pour votre role **")
                    .setFooter(`Vous avez 5 minutes pour entrer le nom.`)
                    .setColor(`#2F3136`))

                    s2.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
                        .then(async collected => {
                            if(message.author.bot){
                                channel.send("Erreur lors de la commande, veuillez contacter un *technicien*")
                                setTimeout(() => {
                                    channel.delete();
                                }, 5000)
                            }

                            roleName = collected.first().content;
                            if(roleName === ""){
                                channel.send("Erreur lors de la commande, veuillez contacter un *technicien*")
                                setTimeout(() => {
                                    channel.delete();
                                }, 5000)
                                return;
                            }

                            let s3 = await channel.send(new DISCORD.MessageEmbed()
                            .setTitle("**Entrez le code hex de la couleur que vous désirez pour votre role **")
                            .setDescription("FAQ: \n **Où trouvez le code hex des couleurs ?** - __https://www.color-hex.com/__ \n \n **IMPORTANT:**\n N'oubliez pas de retirer le # devant le code hex")
                            .setFooter(`Vous avez 5 minutes pour entrer le code hex.`)
                            .setColor("#2F3136"))

                            s3.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
                            .then(async collected => {
                                if(message.author.bot){
                                    channel.send("Erreur lors de la commande, veuillez contacter un *technicien*")
                                                        setTimeout(() => {
                                                            channel.delete();
                                                        }, 5000)
                                }

                                 roleColor = collected.first().content;

                                 if(roleColor === ""){
                                    channel.send("Erreur lors de la commande, veuillez contacter un *technicien*")
                                                        setTimeout(() => {
                                                            channel.delete();
                                                        }, 5000)
                                    return;
                                }

                                message.guild.roles.create({
                                    data: {
                                        name: roleName,
                                        color: roleColor,
                                        position: CONFIG.PERSO_ROLE_POS
                                    }
                                }).then(role => {
                                    let member = message.guild.members.cache.get(user.id)
                                    member.roles.add(role);
                                    channel.send("Votre commande à été finalisée")
                                    setTimeout(() => {
                                        channel.delete();
                                    }, 5000)
                                }).catch(err => {
                                    channel.send("Erreur lors de la commande, veuillez contacter un *technicien*")
                                                        setTimeout(() => {
                                                            channel.delete();
                                                        }, 5000)
                                })

                                

                            }).catch(collected => {
                                channel.send("Temps écoulé, si vous n'avez pas eu le temps veuillez contacter un *technicien*");
                            })

                        }).catch(collected => {
                            message.channel.send("Temps écoulé, si vous n'avez pas eu le temps veuillez contacter un *technicien*");
                        })



                })
            })
        }

        ///* | [REACT 2] | *////
        if(reaction._emoji.name === "2️⃣") {
            price = 15000;
            let authorCoins;
            let channelName = "";
            let channelType = "";
            let channelMax;

            DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", user.id, function(err, rows){
                if(err) LOGGER.error(err);
                if(rows.length < 1){DATABASE.CheckUserInDB(user.id);} else {
                    authorCoins = rows[0].user_coins;
                }

                if(authorCoins < price) return message.channel.send(`**${user.tag}**, vous n'avez pas assez d'coins...`)

                DATABASE.DB.query("UPDATE coins SET user_coins = ? WHERE user_id = ?", [(authorCoins - price), user.id]);

                reaction.message.guild.channels.create(`Commande n${user.id}`, {type: "text", permissionOverwrites: [
                    {
                        id: reaction.message.guild.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: user.id,
                        allow: ['VIEW_CHANNEL'],
                    },
                ],}).then(async channel => {
                    reaction.message.channel.send(`Merci pour votre achat, cliquez sur ce salon pour finaliser votre commande **[<#${channel.id}>]**`)
                    channel.send(new DISCORD.MessageEmbed()
                    .setDescription(`Merci pour votre achat <@${user.id}>, veuillez configurer votre channel ci-dessous`)
                    .setColor(`#2F3136`))
                    const filter = m => m.author.id == message.author.id;
                    let s2 = await channel.send(new DISCORD.MessageEmbed()
                    .setTitle("**Entrez le nom que vous désirez pour votre channel **")
                    .setFooter(`Vous avez 5 minutes pour entrer le nom.`)
                    .setColor(`#2F3136`))

                    s2.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
                    .then(async collected => {
                        if(message.author.bot){
                            channel.send("Erreur lors de la commande, veuillez contacter un *technicien*")
                            setTimeout(() => {
                                channel.delete();
                            }, 5000)
                        }

                        channelName = collected.first().content;
                        if(channelName === ""){
                            channel.send("Erreur lors de la commande, veuillez contacter un *technicien*")
                            setTimeout(() => {
                                channel.delete();
                            }, 5000)
                            return;
                        }

                        let s3 = await channel.send(new DISCORD.MessageEmbed()
                        .setTitle("**Entrez le type de votre channel**")
                        .setDescription("FAQ: \n **C'est quoi le type ?** - __Voici les différents type disponible:__ Type: text (Salon textuel) et voice (Salon vocal) \n ")
                        .setFooter(`Vous avez 5 minutes pour entrer le type.`)
                        .setColor(`#2F3136`))

                        s3.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
                        .then(async collected => {
                            if(message.author.bot){
                                channel.send("Erreur lors de la commande, veuillez contacter un *technicien*")
                                                    setTimeout(() => {
                                                        channel.delete();
                                                    }, 5000)
                            }

                            channelType = collected.first().content;

                            if(channelType === ""){
                                channel.send("Erreur lors de la commande, veuillez contacter un *technicien*")
                                                    setTimeout(() => {
                                                        channel.delete();
                                                    }, 5000)
                                return;
                            }

                            if(channelType == "text"){
                                message.guild.channels.create(channelName, {type: "text", parent: CONFIG.PERSOCAT, permissionOverwrites: [
                                    {
                                        id: user.id,
                                        allow: ['MANAGE_MESSAGES', 'VIEW_CHANNEL'],
                                    },
                                    
                                ],})
                                channel.send("Votre commande à été finalisée");
                                setTimeout(() => {
                                    channel.delete();
                                }, 5000)
                                return;
                            } else if(channelType == "voice"){
                                let s4 = await channel.send(new DISCORD.MessageEmbed()
                                .setTitle("**Entrez le nombre maximum de personnes pouvant rejoindre votre channel**")
                                .setDescription("**IMPORTANT:**\n Choisissez un nombre entre 1 et 99")
                                .setFooter(`Vous avez 5 minutes pour entrer le nombre.`)
                                .setColor("2c2f33"))

                                s4.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
                                .then(async collected => {
                                    if(message.author.bot){
                                        channel.send("Erreur lors de la commande, veuillez contacter un *technicien*")
                                                            setTimeout(() => {
                                                                channel.delete();
                                                            }, 5000)
                                    }
                                    channelMax = collected.first().content;

                                    if(channelMax === "" || Number.isInteger(channelMax) == true){
                                        channel.send("Erreur lors de la commande, veuillez contacter un *technicien*");
                                        setTimeout(() => {
                                            channel.delete();
                                        }, 5000)
                                        return;
                                    }

                                    if(channelMax > 99){
                                        channelMax = 99;
                                   }

                                   if(channelMax == 0) {
                                    channelMax = 1;
                                } 

                                message.guild.channels.create(channelName, {type: "voice",userLimit: channelMax , parent: CONFIG.PERSOCAT,permissionOverwrites: [
                                    {
                                        id: user.id,
                                        allow: ["MOVE_MEMBERS", 'VIEW_CHANNEL', 'CONNECT'],
                                    },
                                    
                                ],})

                                channel.send("Votre commande à été finalisée");
                                    setTimeout(() => {
                                        channel.delete();
                                    }, 5000)
                                return;


                                })


                            } else if(channelType !== "voice" && "text"){
                                message.guild.channels.create(channelName, {type: "text", parent: CONFIG.PERSOCAT, permissionOverwrites: [
                                    {
                                        id: user.id,
                                        allow: ['MANAGE_MESSAGES'],
                                    },
                                    
                                ],})
                                channel.send("Votre commande à été finalisée");
                                setTimeout(() => {
                                    channel.delete();
                                }, 5000)
                                return;
                            }
                        }).catch(collected => {
                            channel.send("Temps écoulé, si vous n'avez pas eu le temps veuillez contacter un *technicien*");
                                                    setTimeout(() => {
                                                        channel.delete();
                                                    }, 5000)
                        })
                    }).catch(collected => {
                        message.channel.send("Temps écoulé, si vous n'avez pas eu le temps veuillez contacter un *technicien*");
                    })
                })
            })
        }






        if(reaction._emoji.name === "3️⃣") {
            price = 15000;
            let authorCoins;
            let teamRole;
            let teamName;
            let teamText;
            let teamVoice;
            let teamChief;
            let teamColor;


            DATABASE.DB.query("SELECT * FROM teams", function(err, rows){
                if(err) LOGGER.error(err);
                var isTeam = false;
                if(rows.length < 1) {isTeam = false} else {
                for(var i = 0; i < rows.length; i++){
                    let mJson = JSON.parse(rows[i].team_members).members;
        
                    mJson.forEach(value => {if(value == user.id) isTeam = true;})
                }
            }
            console.log(isTeam)
            if(isTeam == true) return message.channel.send(`**${user.tag}**, vous êtes déjà dans une team!`)
                
            DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", user.id, function(err, rows){
                if(err) LOGGER.error(err);
                if(rows.length < 1){DATABASE.CheckUserInDB(user.id);} else {
                    authorCoins = rows[0].user_coins;
                }

                if(authorCoins < price) return message.channel.send(`**${user.tag}**, vous n'avez pas assez d'fraises...`)

                DATABASE.DB.query("UPDATE coins SET user_coins = ? WHERE user_id = ?", [(authorCoins - price), user.id]);
                reaction.message.guild.channels.create(`Commande n${user.username}`, {type: "text", permissionOverwrites: [
                    {
                        id: reaction.message.guild.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: user.id,
                        allow: ['VIEW_CHANNEL'],
                    },
                    {
                        id: reaction.message.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL']
                    },

                ],}).then(async channel => {
                    reaction.message.channel.send(`Merci pour votre achat, cliquez sur ce salon pour finaliser votre commande **[<#${channel.id}>]**`)

                    channel.send(new DISCORD.MessageEmbed()
                    .setDescription(`Merci pour votre achat <@${user.id}>, veuillez configurer votre team ci-dessous`)
                    .setColor(`#2F3136`))

                    const filter = m => m.author.id == message.author.id;
                    let s2 = await channel.send(new DISCORD.MessageEmbed()
                    .setTitle("**Entrez le nom que vous désirez pour votre team **")
                    .setFooter(`Vous avez 5 minutes pour entrer le nom.`)
                    .setColor(`#2F3136`))
                    

                    s2.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
                        .then(async collected => {
                            if(message.author.bot){
                                channel.send("Erreur lors de la commande, veuillez contacter un *technicien*")
                                setTimeout(() => {
                                    channel.delete();
                                }, 5000)
                            }

                            teamName = collected.first().content;
                            if(teamName === ""){
                                channel.send("Erreur lors de la commande, veuillez contacter un *technicien*")
                                setTimeout(() => {
                                    channel.delete();
                                }, 5000)
                                return;
                            }

                            let s3 = await channel.send(new DISCORD.MessageEmbed()
                            .setTitle("**Entrez le code hex de la couleur que vous désirez pour votre team **")
                            .setDescription("FAQ: \n **Où trouvez le code hex des couleurs ?** - __https://www.color-hex.com/__ \n \n **IMPORTANT:**\n N'oubliez pas de retirer le # devant le code hex")
                            .setFooter(`Vous avez 5 minutes pour entrer le code hex.`)
                            .setColor(`#2F3136`))

                            s3.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
                            .then(async collected => {
                                if(message.author.bot){
                                    channel.send("Erreur lors de la commande, veuillez contacter un *technicien*")
                                                        setTimeout(() => {
                                                            channel.delete();
                                                        }, 5000)
                                }

                                teamColor = collected.first().content;

                                 if(teamColor === ""){
                                    channel.send("Erreur lors de la commande, veuillez contacter un *technicien*")
                                                        setTimeout(() => {
                                                            channel.delete();
                                                        }, 5000)
                                    return;
                                }

                                message.guild.roles.create({
                                    data: {
                                        name: teamName,
                                        color: teamColor,
                                        position: CONFIG.TEAM_ROLE_POS
                                    }
                                }).then(role => {
                                    let member = message.guild.members.cache.get(user.id)
                                    teamRole = role.id;
                                    teamChief = user.id;
                                    member.roles.add(role);
                                    channel.send("Votre team à été crée, vous allez recevoir un message privé pour les commandes de gestions.")

                                    let tmembers = {
                                        members:[user.id]
                                    }

                                    DATABASE.DB.query("INSERT INTO teams (team_name, team_chief_id, team_members, team_role_id) VALUES (?,?,?,?)", [teamName, teamChief, JSON.stringify(tmembers), teamRole]);

                                    message.guild.channels.create(teamName, {type: "voice",userLimit: 99 , parent: CONFIG.TEAMCAT,permissionOverwrites: [
                                        {
                                            id: user.id,
                                            allow: ["MOVE_MEMBERS", 'CONNECT', 'VIEW_CHANNEL'],
                                        },
                                        {
                                            id: teamRole,
                                            allow: ["CONNECT", 'VIEW_CHANNEL'],
                                        },
                                        {
                                            id: reaction.message.guild.id,
                                            deny: ['CONNECT'],
                                        },
                                        {
                                            id: reaction.message.guild.roles.everyone,
                                            deny: ['VIEW_CHANNEL']
                                        },
                                        
                                    ],}).then(vchannel => {
                                        teamVoice = vchannel.id;
                                        DATABASE.DB.query("UPDATE teams SET team_voice_id = ? WHERE team_chief_id = ?", [teamVoice, teamChief])
                                    })

                                    message.guild.channels.create(teamName, {type: "text", parent: CONFIG.TEAMCAT, permissionOverwrites: [
                                        {
                                            id: user.id,
                                            allow: ['MANAGE_MESSAGES', 'VIEW_CHANNEL', 'SEND_MESSAGES'],
                                        },
                                        {
                                            id: teamRole,
                                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                                        },
                                        {
                                            id: reaction.message.guild.id,
                                            deny: ['READ_MESSAGE_HISTORY'],
                                        },
                                        {
                                            id: reaction.message.guild.roles.everyone,
                                            deny: ['VIEW_CHANNEL']
                                        },
                                        
                                    ],}).then(tchannel => {
                                        teamText = tchannel.id;
                                        DATABASE.DB.query("UPDATE teams SET team_text_id = ? WHERE team_chief_id = ?", [teamText, teamChief])
                                    })

                                    


                                    setTimeout(() => {
                                        channel.delete();
                                    }, 5000)
                                }).catch(err => {
                                    channel.send("Erreur lors de la commande, veuillez contacter un *technicien*")
                                                        setTimeout(() => {
                                                            channel.delete();
                                                        }, 5000)
                                })

                                

                            }).catch(collected => {
                                channel.send("Temps écoulé, si vous n'avez pas eu le temps veuillez contacter un *technicien*");
                            })

                        }).catch(collected => {
                            message.channel.send("**Temps écoulé, si vous n'avez pas eu le temps veuillez contacter un *technicien*");
                        })



                })
            })
        
})
        }
    })


    

}



module.exports.config = {
    category: "Boutique",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["shop"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour voir la boutique",
    utilisations: `.boutique`,
    exemples: `.boutique`
}