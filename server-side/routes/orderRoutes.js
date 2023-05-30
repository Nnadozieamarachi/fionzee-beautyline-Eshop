const express = require('express');
const router = express.Router();
const {getOrder,getOrders, postOrder,countOrders,getUserOrders,totalSales, orderUpdate, deleteOrder} = require('../orderControllers')



//routes
// router.route("/anOrder").get(getOrder);
router.route("/").get(getOrders);

router.route("/").post(postOrder);
router.route("/:id").get(getOrder);

router.route("/:id").put(orderUpdate);
router.route("/:id").delete(deleteOrder);
    

module.exports = router;
