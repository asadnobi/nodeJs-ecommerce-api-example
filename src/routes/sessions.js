var express = require('express');
var router = express.Router();
const SessionController = require("../controllers/session");


// for POST a session data
router.route("/sessions").post(SessionController.createToken);
// for GET a session data
router.route("/sessions/:id").get(SessionController.getToken);
// for UPDATE a session data
router.route("/sessions/:id").put(SessionController.updateToken);
// for DELETE a session data
router.route("/sessions/:id").delete(SessionController.deleteToken);

module.exports = router;
