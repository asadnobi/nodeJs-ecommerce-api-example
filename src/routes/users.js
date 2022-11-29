var express = require('express');
var router = express.Router();
const UserController = require("../controllers/user");
const checkQuery = require("../middlewares/checkQuery");
const createToken = require("../middlewares/createToken");
const checkToken = require("../middlewares/checkToken");
const checkRole = require("../middlewares/checkRole");
const fileUpload = require("../middlewares/upload");


// for GET user list data
router.route("/users").get(checkQuery, UserController.getUserList);
// for POST a user data
router.route("/users").post(fileUpload.single('profile_img'), UserController.postUser);
// for GET a user data
router.route("/users/:userId").get(UserController.getUser);
// for UPDATE a user data
router.route("/users/:userId").put(UserController.updateUser);
// for DELETE a user data
router.route("/users/:userId").delete(checkRole, UserController.deleteUser);
// for DELETE all user
router.route("/users").delete(checkToken, UserController.deleteUserList);
// for GET register user data
router.route("/register-user").post(UserController.registerUser, createToken);
// for GET login user data
router.route("/login-user").post(UserController.loginUser, createToken);
// for GET a user data by email
router.route("/find-user").get(UserController.queryUser);

module.exports = router;
