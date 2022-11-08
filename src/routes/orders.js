var express = require('express');
var router = express.Router();
const OrderController = require("../controllers/order");
const checkQuery = require("../middlewares/checkQuery");


// for GET order list data
router.route("/orders").get(checkQuery, OrderController.order_get_all_data);
// for POST a order data
router.route("/orders").post(OrderController.order_post_data);
// for GET a order data
router.route("/orders/:orderId").get(OrderController.order_get_data);
// for UPDATE a order data
router.route("/orders/:orderId").put(OrderController.order_update_data);
// for DELETE a order data
router.route("/orders/:orderId").delete(OrderController.order_delete_data);

module.exports = router;
