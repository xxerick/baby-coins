/////* || [INITIALIZATION] || */////
const LOGGER = require("../../INITIALIZATION/logger")
const CONFIG = require("../../INITIALIZATION/config.js")
const DATABASE = require("../../INITIALIZATION/db.js")
const DISCORD = require("discord.js");
const FS = require("fs")
const CANVAS = require("canvas");
var isPlayed = {};

/////* || [ACTIONS] || */////
module.exports.run = async(CLIENT, message, ARGS, PREFIXARRAY) => {
  //  if(isPlayed[message.channel.id] === true) return message.channel.send("Un coinflip est déjà en cours dans ce salon!")

    //    isPlayed[message.channel.id] = true;
        let channel = CLIENT.channels.resolve(message.channel.id);
        
    let steps = ["**Début dans quelques secondes.**", "**Début dans quelques secondes..**", "**Début dans quelques secondes...**", "**Début dans quelques secondes.**", "**Début dans quelques secondes..**", "**Début dans quelques secondes...**", "**Début dans quelques secondes.**", "**Début dans quelques secondes..**", "**Début dans quelques secondes...**"];
    let mise;
    if(ARGS[0]){
        if(Number.isInteger(ARGS[0])){
            mise = ARGS[0]
        } else {
            return message.channel.send("Met un nombre !")
        }
    } else {
        mise = parseFloat(Math.floor(Math.random() * 200));
    }
    let time = 1000;
    var userMise = {};
    var userParticipate = [];

    let confirm = await channel.send(new DISCORD.MessageEmbed()
                        .setTitle(`Pile ou Face ?`)
                        .setDescription(`La mise est de **${mise}** fraises\n\n1️⃣ ・ pile **X2**\n2️⃣ ・ face **X2**\n\n Vous avez *30* secondes pour choisir.`)
                       // .setImage("https://acegif.com/wp-content/uploads/coin-flip.gif")
                        .setColor(`#2F3136`)
                        )
                        confirm.react("1️⃣"); confirm.react("2️⃣");

                        const filter = (reaction, user) => {
                            return ['1️⃣', '2️⃣'].includes(reaction.emoji.name) && !user.bot;
                        };

                        const collector = confirm.createReactionCollector(filter, { time: 30000 });
                        collector.on("collect", (reaction, user) => {
                            if (reaction.emoji.name === '1️⃣') {
                                DATABASE.CheckUserInDB(user.id);
                                DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", user.id, function(err, rows){
                                    if(err) LOGGER.error(err);
                                    if(rows.length < 1){} else {
                                        let userCoins = rows[0].user_coins;

                                        if(userCoins < mise){
                                            return message.channel.send(`**${user.tag}**, Vous n'avez pas assez d'fraises.`)
                                        } else {
                                            userMise[user.id] = "pile"
                                            if(!userParticipate.includes(user.id)) userParticipate.push(user.id)
                                        }
                                    }
                                })
                            }
                            if (reaction.emoji.name === '2️⃣') {
                                DATABASE.CheckUserInDB(user.id);
                                DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", user.id, function(err, rows){
                                    if(err) LOGGER.error(err);
                                    if(rows.length < 1){} else {
                                        let userCoins = rows[0].user_coins;

                                        if(userCoins < mise){
                                            return message.channel.send(`**${user.tag}**, Vous n'avez pas assez d'fraises.`)
                                        } else {
                                            userMise[user.id] = "face"
                                            if(!userParticipate.includes(user.id)) userParticipate.push(user.id)
                                        }
                                    }
                                })
                            }
                        })

                        collector.on('end', collected => {

                            
                        let colorArr = ["1️⃣", "2️⃣"]
                        let color;
                        let couleurGagnante = colorArr[Math.floor(Math.random() * colorArr.length)];
                        let result;
                        let imageF;

                        if(couleurGagnante === "1️⃣") {color = "#2F3136"; result = "Result : pile"; imageF = "https://media.discordapp.net/attachments/659697532015738880/805389689175539712/pile1-removebg-preview.png"}
                        if(couleurGagnante === "2️⃣") {color = "#2F3136"; result = "Result : face"; imageF = "https://media.discordapp.net/attachments/659697532015738880/805389105482825769/face1-removebg-preview.png"}


                        let stringGagnant = "";
                        var alreadyGived = {};
                        userParticipate.forEach(user => {
                            if(userMise[user] === result){
                                stringGagnant += `<@${user}> `
                                DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", user, function(err, rows){
                                    if(err) LOGGER.error(err);
                                    if(rows.length < 1){} else {
                                        let argent = rows[0].user_coins;
                                        let finalArgent;
                                        if(result == "pile" || result == "face") finalArgent = mise + argent;
                                        DATABASE.DB.query("UPDATE coins SET user_coins = ? WHERE user_id = ?", [finalArgent, user])
                                    }
                                })
                            }  else {
                                DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", user, function(err, rows){
                                    if(err) LOGGER.error(err);
                                    if(rows.length < 1){} else {
                                        let argent = rows[0].user_coins;
                                        let finalArgent = argent - mise;
                                        DATABASE.DB.query("UPDATE coins SET user_coins = ? WHERE user_id = ?", [finalArgent, user])
                                    }
                                })
                            }
                        })

                        if(stringGagnant.length < 1) stringGagnant = "aucun"
                        channel.send(new DISCORD.MessageEmbed()
                            .setImage(imageF)
                            .setTitle(result)
                            .setColor(`#2F3136`)
                        )
                        channel.send(`Les gagnants sont: ${stringGagnant}`)
                        isPlayed[message.channel.id] = false;
                        });

}



module.exports.config = {
    category: "Casino",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["pileface"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour jouer au coinflp",
    utilisations: `.coinflip`,
    exemples: `.coinflip`
}