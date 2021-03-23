/////* || [INITIALIZATION] || */////
const LOGGER = require("../INITIALIZATION/logger.js")
const CONFIG = require("../INITIALIZATION/config.js")
const DATABASE = require("../INITIALIZATION/db.js")
const DISCORD = require("discord.js");

var leaved = {};
var alreadyKnow = {};
var timeKnow = {};

/////* || [ACTIONS] || */////
module.exports = async(CLIENT, oldMember, newMember) => {

    let logsChannel = CLIENT.channels.resolve("802260254053630042")
    let newUserChannel = newMember.channelID;
    let oldUserChannel = oldMember.channelID;
    let i = 1;
    


    if(newUserChannel != undefined) {
     //   LOGGER.log(`EVENT: ${newMember.member.user.tag} JOINED ${newUserChannel}`)
        DATABASE.CheckUserInDB(newMember.id);
        if(alreadyKnow[newMember.id] == true) return;
        if(newMember.bot) return;
        leaved[newMember.id] = false;
        while(newUserChannel != undefined){
            

            if(leaved[newMember.id] == true){
                alreadyKnow[newMember.id] = false;
                break;
            }
            alreadyKnow[newMember.id] = true;
            await sleep(60000);
            if(!CLIENT.users.cache.get(newMember.id).bot){
                
                let msgauthor = newMember.id;
                DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", msgauthor, function(err, rows){
                    if(err) LOGGER.error(err);
                    if(rows.length < 1) {DATABASE.CheckUserInDB(msgauthor)} else {
                        let currentMoney = rows[0].user_coins;
                        let newMoney = (Math.random() * (1.348 - 0.580) + 0.580);
                        let finalCoins = parseFloat(currentMoney + newMoney);
            
                        DATABASE.DB.query("UPDATE coins SET user_coins = ? WHERE user_id = ?", [finalCoins, msgauthor])
                    }
                })
               // LOGGER.log(`${newMember.member.user.tag} - ${i++}mn`)
              }
              
           
           
       } 
  
  
    } else{
        timeKnow[newMember.id] = 0;
        leaved[newMember.id] = true;
        alreadyKnow[newMember.id] = false;
      //  console.log(`${newMember.member.user.tag} Leaved`)
    }

};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}