var express = require('express');
var router = express.Router();
const UserController = require("../controllers/user");


// for GET user list data
router.get("/", UserController.user_get_all_data);
// for POST a user data
router.post("/", UserController.user_post_data);
// for GET a user data
router.get('/:userId', UserController.user_get_data);
// for UPDATE a user data
router.put('/:userId', UserController.user_update_data);
// for DELETE a user data
router.delete('/:userId', UserController.user_delete_data);

module.exports = router;
