var express = require('express');
var router = express.Router();
const keyController = require("../controllers/apiKey");
const checkQuery = require("../middlewares/checkQuery");


// for GET api key list
router.route("/apikey").get(checkQuery, keyController.getAllApiKey);
// for POST a api key
router.route("/apikey").post(keyController.postAnApiKey);
// for GET a api key
router.route("/apikey/:keyId").get(keyController.getAnApiKey);
// for UPDATE a api key
router.route("/apikey/:keyId").put(keyController.updateAnApiKey);
// for DELETE a api key
router.route("/apikey/:keyId").delete(keyController.deleteAnApiKey);
// for DELETE all api key
router.route("/apikey").delete(keyController.deleteAllApiKey);

module.exports = router;
