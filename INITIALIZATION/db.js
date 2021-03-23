const MYSQL = require("mysql2")
const CONFIG = require("./config.js");
const LOGGER = require("./logger.js")

const DB = MYSQL.createConnection(CONFIG.DATABASE_0);

  exports.DB = DB;

  exports.CheckUserInDB = function(userId){
      DB.query("SELECT * FROM coins WHERE user_id = ?", userId, function(err, rows){
          if(err) LOGGER.error(err);
          if(rows.length < 1){DB.query("INSERT INTO coins (user_id) VALUES (?)", userId)} else {
              
          }
      })
  }
