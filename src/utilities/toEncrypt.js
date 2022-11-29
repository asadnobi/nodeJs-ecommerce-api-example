var CryptoJS = require("crypto-js");

const toEncrypt = text => {
    return CryptoJS.AES.encrypt(text, process.env.API_SECRET).toString();
}

module.exports = toEncrypt;