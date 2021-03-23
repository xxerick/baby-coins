const LOGGER = require("js-logger");

LOGGER.useDefaults();
LOGGER.currentTime = `\n[${minTwoDigits(new Date().getHours())}:${minTwoDigits(new Date().getMinutes())}:${minTwoDigits(new Date().getSeconds())}] - `;
module.exports.embedTime = `${minTwoDigits(new Date().getHours())}:${minTwoDigits(new Date().getMinutes())}:${minTwoDigits(new Date().getSeconds())}`;

/////* || [ERROR] || */////
module.exports.error = function(String){
    return LOGGER.error(LOGGER.currentTime + String);
}

/////* || [WARN] || */////
module.exports.warn = function(String){
    return LOGGER.warn(LOGGER.currentTime + String);
}

/////* || [DEBUG] || */////
module.exports.debug = function(String){
    return LOGGER.debug(LOGGER.currentTime + String);
}

/////* || [INFO] || */////
module.exports.info = function(String){
    return LOGGER.info(LOGGER.currentTime + String);
}

/////* || [LOG] || */////
module.exports.log = function(String){
    return LOGGER.log(LOGGER.currentTime + String);
}

/////* || [TRACE] || */////
module.exports.trace = function(String){
    return LOGGER.trace(LOGGER.currentTime + String);
}

function minTwoDigits(n) {
    return (n < 10 ? '0' : '') + n;
  }