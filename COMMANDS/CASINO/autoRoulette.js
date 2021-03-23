/////* || [INITIALIZATION] || */////
const LOGGER = require("../../INITIALIZATION/logger")
const CONFIG = require("../../INITIALIZATION/config.js")
const DATABASE = require("../../INITIALIZATION/db.js")
const DISCORD = require("discord.js");
const FS = require("fs")
const CANVAS = require("canvas");

/////* || [ACTIONS] || */////
module.exports.run = async(CLIENT, message, ARGS, PREFIXARRAY) => {
    if(message.author.id != '188356697482330122' || message.author.id != '659038301331783680' ) return;
    message.channel.send("*Auto Roulette* a été activé.")
    setInterval(async () => {
        let channel = CLIENT.channels.resolve(CONFIG.ROULETTE);
        
    let steps = ["**Début dans quelques secondes.**", "**Début dans quelques secondes..**", "**Début dans quelques secondes...**", "**Début dans quelques secondes.**", "**Début dans quelques secondes..**", "**Début dans quelques secondes...**", "**Début dans quelques secondes.**", "**Début dans quelques secondes..**", "**Début dans quelques secondes...**"];
    let mise = parseFloat(Math.floor(Math.random() * 1000));
    let time = 1000;
    var userMise = {};
    var userParticipate = [];

    let confirm = await channel.send(new DISCORD.MessageEmbed()
                        .setTitle(`En attente des mises...`)
                        .setColor(`#2F3136`)
                        .setDescription(`La mise est de _**${mise} coins**_\n\n🔴 ・ **X2**\n⚫ ・ **X2**\n🟢 **X5**\n\n Vous avez *60* secondes pour miser.`)
                       // .setImage("https://thumbs.gfycat.com/LivelyObviousAnhinga-size_restricted.gif")
                        )
                        confirm.react("🔴"); confirm.react("⚫"); confirm.react("🟢");

                        const filter = (reaction, user) => {
                            return ['🔴', '⚫', '🟢'].includes(reaction.emoji.name) && !user.bot;
                        };

                        const collector = confirm.createReactionCollector(filter, { time: 90000 });
                        collector.on("collect", (reaction, user) => {
                            if (reaction.emoji.name === '🔴') {
                                DATABASE.CheckUserInDB(user.id);
                                DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", user.id, function(err, rows){
                                    if(err) LOGGER.error(err);
                                    if(rows.length < 1){} else {
                                        let userCoins = rows[0].user_coins;

                                        if(userCoins < mise){
                                            return user.send("Vous n'avez pas assez d'coins.")
                                        } else {
                                            userMise[user.id] = "rouge"
                                            if(!userParticipate.includes(user.id)) userParticipate.push(user.id)
                                        }
                                    }
                                })
                            }
                            if (reaction.emoji.name === '⚫') {
                                DATABASE.CheckUserInDB(user.id);
                                DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", user.id, function(err, rows){
                                    if(err) LOGGER.error(err);
                                    if(rows.length < 1){} else {
                                        let userCoins = rows[0].user_coins;

                                        if(userCoins < mise){
                                            return user.send("Vous n'avez pas assez d'coins.")
                                        } else {
                                            userMise[user.id] = "noir"
                                            if(!userParticipate.includes(user.id)) userParticipate.push(user.id)
                                        }
                                    }
                                })
                            }
                            if (reaction.emoji.name === '🟢') {
                                DATABASE.CheckUserInDB(user.id);
                                DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", user.id, function(err, rows){
                                    if(err) LOGGER.error(err);
                                    if(rows.length < 1){} else {
                                        let userCoins = rows[0].user_coins;

                                        if(userCoins < mise){
                                            return user.send("Vous n'avez pas assez d'coins.")
                                        } else {
                                            userMise[user.id] = "vert"
                                            if(!userParticipate.includes(user.id)) userParticipate.push(user.id)
                                        }
                                    }
                                })
                            }
                        })

                        collector.on('end', collected => {

                            
                        let colorArr = ["🔴", "🟢", "⚫", "aucun"]
                        let color;
                        let couleurGagnante = colorArr[Math.floor(Math.random() * colorArr.length)];
                        let result;

                        if(couleurGagnante === "🔴") {color = "#2F3136"; result = "Result : rouge"}
                        if(couleurGagnante === "🟢") {color = "#2F3136"; result = "Result : vert"}
                        if(couleurGagnante === "⚫") {color = "#2F3136"; result = "Result : noir"}
                        if(couleurGagnante === "aucun") {color = "#2F3136"; result = "Result : aucun"}

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
                                        if(result == "rouge" || result == "noir") finalArgent = mise + argent;
                                        if(result == "vert") finalArgent = (mise*3) + argent;
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
                        channel.send(createImage(couleurGagnante, color))
                        channel.send(`Les gagnants sont: ${stringGagnant}`)
                        });




    }, 180000)
}



module.exports.config = {
    category: "owner",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["euhjioqsdfjhodlihf"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour jouer à la Roulette",
    utilisations: `.roulette`,
    exemples: `.roulette`
}

function createImage(text, color){
    // Create the image with the dezired size (width, height) :
    let canvas = new CANVAS.Canvas(1750, 250);

    // Fill the background with white color :
    let background = canvas.getContext("2d");

    background.fillStyle = "#FFFFFF";
    background.fillRect(0, 0, canvas.width, canvas.height);

    // Add green rectangle in the center :
    let greenRectangle = canvas.getContext("2d");

    greenRectangle.fillStyle = color;
    greenRectangle.fillRect(25, 25, canvas.width - 50, canvas.height - 50);

    // Add the text :
    let textContext = canvas.getContext("2d");

    textContext.fillStyle = "#FFFFFF";
    
    textContext.font = "100px Arial";

    textContext.fillText(
        text, 
        (canvas.width / 2) - (textContext.measureText(text).width / 2), 
        (canvas.height / 2) + 30
    );
    
    // Return the image :
    return new DISCORD.MessageAttachment(canvas.toBuffer(), "keyspeed.png");
}