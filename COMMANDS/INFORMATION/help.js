/////* || [INITIALIZATION] || */////
const LOGGER = require("../../INITIALIZATION/logger")
const CONFIG = require("../../INITIALIZATION/config.js")
const DATABASE = require("../../INITIALIZATION/db.js")
const DISCORD = require("discord.js");

/////* || [ACTIONS] || */////
module.exports.run = async(CLIENT, message, ARGS, PREFIXARRAY) => {

    let category = [];

    let getGuildSetting = `SELECT * FROM guildsettings WHERE guildId = '${message.guild.id}';`;





        let embed = new DISCORD.MessageEmbed();
        embed.setAuthor(`Informations et commandes`, `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
        embed.setColor(`#2F3136`)
   //     embed.addField(`<a:star:800819594377297941> **Owner:**`, `\`autoCoinFlip\`, \`autoRoulette\``, false)
        embed.addField(`**Gestion des fraises:**`, `\`shop\`, \`fraises\`, \`leaderboard\`, \`pay\`, \`coinflip\`, \`roulette\``, false)
        embed.addField(`**Teams:**`, `\`invite\`, \`info\`, \`kick\`, \`topTeam\`, \`leave\``, false)
        CLIENT.COMMANDS.forEach(command => {
            if (category.indexOf(command.config.category) == -1) {
                category.push(command.config.category)
            }
        });


        category.forEach(catégorie  => {
            let commandlist = "";
            CLIENT.COMMANDS.forEach(command => {
                if (command.config.category == catégorie ) {
                    commandlist = commandlist + "`" + command.config.name + "` "
                }
            })
           // embed.addField(catégorie, commandlist);
        });

        message.channel.send(embed);



}



module.exports.config = {
    category: "Information",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["h"],
    serverForced: false
}

module.exports.help = {
    description: "Command to see all Commands",
    utilisations: `help`,
    exemples: `i+help`
}