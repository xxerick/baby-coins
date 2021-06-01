/////* || [INITIALIZATION] || */////
const LOGGER = require("./INITIALIZATION/logger.js")
const CONFIG = require("./INITIALIZATION/config.js")
const DATABASE = require("./INITIALIZATION/db.js")

DATABASE.DB.connect(function(err) {if (err) throw LOGGER.error(err);LOGGER.info("Connected to DATABASE [DB]")});

/////* || [LOG] || */////
LOGGER.info(`Starting bot...`);
 
/////* || [CONST] || */////
const DISCORD = require("discord.js"); 
const WEBHOOK = require('discord-webhook-node');
const HOOK = new WEBHOOK.Webhook(CONFIG.WEBHOOK);
//const ENMAP = require("enmap");
const FS = require("fs");
const RECURSIVE = require("recursive-readdir");
const message = require("./EVENTS/message.js");
const CLIENT = new DISCORD.Client({fetchAllMembers: true});

/////* || [CLIENT] || */////
CLIENT.login(CONFIG.TOKEN).then(success => LOGGER.info("Connnected to Discord")).catch(error => LOGGER.error(error));

/////* || [EVENTS | COMMANDS] || */////
let fileNumber = 0;
CLIENT.COMMANDS = new Map();
CLIENT.ALIASES = new Map();

FS.readdir('./EVENTS/', (err, files) => {LOGGER.info("Waiting events...");if (err) return LOGGER.error(err);files.forEach(file => {if (!file.endsWith('.js')) return;const EVENT = require(`./EVENTS/${file}`);let eventName = file.split('.')[0];CLIENT.on(eventName, EVENT.bind(null, CLIENT));LOGGER.warn(`Loading EVENT : ${eventName}`);fileNumber++;})});
RECURSIVE('./COMMANDS/', (err, files) => {if (err) return LOGGER.error(err);files.forEach(file => {if (!file.endsWith('.js')) return;let props = require(`./${file}`);let commandName = file.split(/\\/g).reverse()[0];commandName = commandName.split('.')[0];CLIENT.COMMANDS.set(commandName.toLowerCase(), props);props.config.aliases.forEach(alias => {CLIENT.ALIASES.set(alias.toLowerCase(), props.config.name.toLowerCase());});let aliases = props.config.aliases.map(e => e.toString()).join(", ");LOGGER.warn(`Loading COMMANDS : ${commandName}`);fileNumber++});LOGGER.warn("----------------------------------------------------------------");LOGGER.info(`${fileNumber} FILES LOADED ! `);LOGGER.warn("----------------------------------------------------------------");});

/////* || [CLIENT ERROR | WARN] || */////
CLIENT.on("error", (e) => {HOOK.error('**InvitePlus**', 'ERROR ENCOUNTERED', e.message).catch(err => console.log(err.message));LOGGER.error(e);});
CLIENT.on("warn", (e) => LOGGER.warn(e));

/*
CLIENT.on("message", message => {
    message.guild.members.cache.filter(member => member.user.bot)

    let confirm = await message.channel.send(new DISCORD.MessageEmbed()
    .setTitle(`En attente des mises...`)
    .setDescription(`La mise est de _**${mise} TK$**_\n\n🔴 **X2**\n⚫ **X2**\n🟢 **X5**\n\n Vous avez 60 secondes pour miser.`)
    .setImage("https://thumbs.gfycat.com/LivelyObviousAnhinga-size_restricted.gif")
    )
    confirm.react("🔴"); confirm.react("⚫"); confirm.react("🟢");
    const filter = (reaction, user) => {
        return ['🔴', '⚫', '🟢'].includes(reaction.emoji.name) && !user.bot;
    };

    const collector = confirm.createReactionCollector(filter, { time: 10000 });

    collector.on('end', collected => {
        collected.map()
    })
})
*/


module.exports = CLIENT;

