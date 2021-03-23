/////* || [INITIALIZATION] || */////
const LOGGER = require("../INITIALIZATION/logger.js")
const CONFIG = require("../INITIALIZATION/config.js")
const DATABASE = require("../INITIALIZATION/db.js")
const DISCORD = require("discord.js");


/////* || [ACTIONS] || */////
module.exports = async(CLIENT) => {
    await LOGGER.warn("Client ready... " + CLIENT.user.tag)

};