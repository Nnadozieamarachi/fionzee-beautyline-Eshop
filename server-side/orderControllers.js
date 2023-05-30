
const OrderItem = require('./models/order-item');
const orderModel = require("./models/orderModels");

const getOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().populate('user', 'username').sort({'dateOrdered': -1});
    console.log(orders);
    return res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error});
  }
};

// const postOrder = async (req, res) => {
//   try {
//     const orderItemsIds = await Promise.all( req.body.orderItems.map(async orderItem =>{
//       let newOrderItem = new  OrderItem({
//         quantity: orderItem.quantity,
//         product: orderItem.product
//       })

//       newOrderItem = await newOrderItem.save();

//       return newOrderItem._id;
//     }))

//     const totalPrices = await Promise.all(req.body.orderItems.map(async (orderItemsId) => {
//       item = await OrderItem.findById(orderItemId).populate('product', 'price');
//       const totalPrice = orderItem.product.price * orderItem.quantity;
//       return totalPrice
//     }))
//     const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
//     console.log(totalPrices);
    
//     console.log("request body is: ", req.body);
//     const { orderItems, shippingAddress1, shippingAddress2,status, city,zip, country, phone, user, totalPrice } = req.body;
    

//     const order = await orderModel.create({
//       orderItems: orderItemsIds,
//       shippingAddress1,
//       shippingAddress2,
//       city,
//       zip,
//       country,
//       phone,
//       status,
//       user,
//       totalPrice: totalPrice 
//     });
//     console.log(order);

//     // if (!orderItems || !shippingAddress1 || !shippingAddress2 || !city || !zip || !country || !phone || !user ) {
//     //   res.status(400);
//     //   throw new Error("All fields are mandatory!");
//     // }

//     return res.status(201).json(order);
//   } catch (error) {
//     res.status(500).json(error);
//     console.log(error);
//   }
// };

//updated 

const postOrder = async (req, res) => {
  try {
    const orderItemsIds = await Promise.all(req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    }));

    const totalPrices = await Promise.all(req.body.orderItems.map(async (orderItemId) => {
      const item = await OrderItem.findById(orderItemId).populate('product', 'price');
      const totalPrice = item.product.price * item.quantity;
      return totalPrice;
    }));

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
    console.log(totalPrices);

    console.log("request body is: ", req.body);
    const { orderItems, shippingAddress1, shippingAddress2, status, city, zip, country, phone, user } = req.body;

    const order = await orderModel.create({
      orderItems: orderItemsIds,
      shippingAddress1,
      shippingAddress2,
      city,
      zip,
      country,
      phone,
      status,
      user,
      totalPrice
    });
    console.log(order);

    // if (!orderItems || !shippingAddress1 || !shippingAddress2 || !city || !zip || !country || !phone || !user) {
    //   res.status(400);
    //   throw new Error("All fields are mandatory!");
    // }

    return res.status(201).json(order);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const totalSales = async(req,res) => {
  const totalSales = await OrderItem.aggregate([
    {$group: {_id: null, totalSales: { $sum: '$totalPrice'}}}
  ])

  if(!totalSales) {
    return res.status(400).json('The order sales cannot be generated')
  }
  return res.json({totalsales: totalSales.pop().totalsales})
}

const countOrders = async(req, res) =>{
  try {
    const countSales = await orderModel.countDocuments();

  if(!countSales){
     res.status(404);
    throw new Error("Could not count Available products")
  }
    return res.status(200).json({message:`We have ${countSales} orders`});
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: "Internal Server Error!"})
    
  }
}


const getOrder = async(req, res) => {
  try {
    console.log(req.params.id);
    console.log('hi');
    const order = await orderModel.findById(req.params.id).populate('user', 'name').populate({path:'orderItems', populate:{path:'product', populate: 'category'}});
    console.log(order);
    if (!order) {
      res.status(404).json({error: "No order found"});
    }
    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Internal server error"});
  }
};

const orderUpdate = async (req, res) => {
  try {
    const updateOrder = await orderModel.findOne({ _id:req.params.id});
    
    if (!updateOrder) {
      res.status(404);
      throw new Error("No new order changes found");
    }
    const updatedOrder = await orderModel.findByIdAndUpdate(
      req.params.id,
      {status: req.body.status},
      { new: true }
    );
    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const removeOrder = await orderModel.findById(req.params.id);
    if (!removeOrder) {
      res.status(404);
      throw new Error("No order found");
    } else {
      const removedOrder = await orderModel.findByIdAndRemove(req.params.id, req.body, { new: true })
        if(removedOrder) {
          //remove associated order items

          await Promise.all( removedOrder.orderItems.map(async (orderItem) =>{
            await orderItem.findByIdAndRemove(orderItem)
          }));
        }
        return res.status(200).json(removeOrder);
      };
  
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getUserOrders = async (req, res) => {
  try {
    const userOrderlist = await orderModel.find({user: req.params.userId}).populate({path: 'orderItems', populate: { path: 'product', populate: 'category'}}).sort({'dateOrdered': -1});

    console.log(userOrderlist);
    return res.status(200).json(userOrderlist);
  } 
  catch (error) {
    res.status(500).json({ error: error});
  }
};


module.exports = { getOrders,countOrders,getUserOrders,totalSales, postOrder, getOrder, orderUpdate, deleteOrder };