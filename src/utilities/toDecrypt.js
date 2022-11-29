var CryptoJS = require("crypto-js");

const toDecrypt = text => {
    var bytes  = CryptoJS.AES.decrypt(text, process.env.API_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = toDecrypt;