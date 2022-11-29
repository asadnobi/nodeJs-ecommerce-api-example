var express = require('express');
var router = express.Router();
const ProductController = require("../controllers/product");
const checkQuery = require("../middlewares/checkQuery");
const checkToken = require("../middlewares/checkToken");
const checkRole = require("../middlewares/checkRole");
const fileUpload = require("../middlewares/upload");


// for GET user list data
router.route("/products").get(checkQuery, ProductController.product_get_all_data);
// for POST a user data
router.route("/products").post(fileUpload.array('images'), ProductController.product_post_data);
// for GET a user data
router.route("/products/:productId").get(ProductController.product_get_data);
// for UPDATE a user data
router.route("/products/:productId").put(ProductController.product_update_data);
// for DELETE a user data
router.route("/products/:productId").delete(checkRole, ProductController.product_delete_data);
// for DELETE all user
router.route("/products").delete(checkToken, ProductController.all_product_delete);

module.exports = router;
