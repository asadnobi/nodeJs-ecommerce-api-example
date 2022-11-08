var express = require('express');
var router = express.Router();
const UserController = require("../controllers/user");
const checkQuery = require("../middlewares/checkQuery");
const checkToken = require("../middlewares/checkToken");
const createToken = require("../middlewares/createToken");
const checkRole = require("../middlewares/checkRole");
const upload = require("../middlewares/upload");


// for GET user list data
router.route("/users").get(checkQuery, UserController.user_get_all_data);
// for POST a user data
router.route("/users").post(upload.single('profile_img'), UserController.user_post_data, createToken);
// for GET a user data
router.route("/users/:userId").get(UserController.user_get_data);
// for UPDATE a user data
router.route("/users/:userId").put(UserController.user_update_data);
// for DELETE a user data
router.route("/users/:userId").delete(checkRole, UserController.user_delete_data);
// for DELETE all user
router.route("/users").delete(checkToken, UserController.all_user_delete);
// for GET login user data
router.route("/login-user").post(UserController.user_login_data, createToken);

module.exports = router;
