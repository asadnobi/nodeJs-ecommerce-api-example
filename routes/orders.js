var express = require('express');
var router = express.Router();
const OrderController = require("../controllers/order");


// for GET order list data
router.get("/", OrderController.order_get_all_data);
// for POST a order data
router.post("/", OrderController.order_post_data);
// for GET a order data
router.get('/:orderId', OrderController.order_get_data);
// for UPDATE a order data
router.put('/:orderId', OrderController.order_update_data);
// for DELETE a order data
router.delete('/:orderId', OrderController.order_delete_data);

module.exports = router;
