var express = require('express');
var router = express.Router();
const AccountController = require("../controllers/account");


// for POST a Account data
router.route("/account").post(AccountController.addAccount);
// for GET a Account data
router.route("/account/:id").get(AccountController.getAccount);
// for DELETE a Account data
router.route("/account/:id").delete(AccountController.deleteAccount);
// for search a Account data
router.route("/find-account").get(AccountController.queryAccount);

module.exports = router;
