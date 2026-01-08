import Order from "../models/Order.model.js";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/User.model.js";
import Product from "../models/Product.model.js";

export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Ensure imageUrl is captured correctly from the items
    const sanitizedOrderItems = orderItems.map((item) => ({
      ...item,
      imageUrl: item.imageUrl || item.image // Fallback if frontend sends 'image'
    }));

    // Check stock and decrement
    for (const item of sanitizedOrderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
      }
      product.stock -= item.qty;
      await product.save();
    }

    const order = new Order({
      user: req.user._id,
      orderItems: sanitizedOrderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Remove only the ordered items from the user's cart
    const user = await User.findById(req.user._id);
    
    for (const orderItem of sanitizedOrderItems) {
      const cartItemIndex = user.cart.findIndex(ci => 
        ci.product.toString() === orderItem.product.toString()
      );

      if (cartItemIndex > -1) {
        user.cart.splice(cartItemIndex, 1);
      }
    }
    await user.save();

    res.status(201).json(createdOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    console.log(`[Order] Fetching history for user: ${req.user._id}`);
    const pageSize = Number(req.query.limit) || 5;
    const page = Math.max(1, Number(req.query.page) || 1);

    const keyword = req.query.keyword
      ? { "orderItems.name": { $regex: req.query.keyword, $options: "i" } }
      : {};

    const paymentMethod = req.query.paymentMethod
      ? { paymentMethod: req.query.paymentMethod }
      : {};

    const { startDate, endDate } = req.query;
    let dateQuery = {};
    if (startDate || endDate) {
      dateQuery.createdAt = {};
      if (startDate) dateQuery.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include the entire end day
        dateQuery.createdAt.$lte = end;
      }
    }

    const query = { ...keyword, ...paymentMethod, ...dateQuery, user: req.user._id };

    const totalSpentResult = await Order.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalSpent = totalSpentResult.length > 0 ? totalSpentResult[0].total : 0;

    const count = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .populate("orderItems.product")
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // Sanitize orders to ensure frontend doesn't crash on null (deleted) products
    const sanitizedOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.orderItems = orderObj.orderItems.map(item => {
        if (!item.product) {
          // Fallback for deleted products
          item.product = { 
            _id: "deleted-" + item._id, // Unique ID derived from order item ID to prevent key conflicts
            name: item.name || "Product Unavailable", 
            image: item.imageUrl || "/images/sample.jpg",
            price: item.price
          };
        }
        return item;
      });
      return orderObj;
    });

    res.json({ orders: sanitizedOrders, page, pages: Math.ceil(count / pageSize), totalSpent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate("user", "email name");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "Processing") return res.status(400).json({ message: "Cannot cancel order that is not in Processing state" });

    order.status = "Cancelled";
    const updatedOrder = await order.save();

    try {
      await sendEmail({
        email: order.user.email,
        subject: "Order Cancelled",
        message: `Hello ${order.user.name},\n\nYour order #${order._id} has been successfully cancelled.\n\nRegards,\nEcom Team`
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product"); // Populate product details to prevent frontend errors

    if (order) {
      // Sanitize single order to handle deleted products
      const orderObj = order.toObject();
      orderObj.orderItems = orderObj.orderItems.map(item => {
        if (!item.product || item.product === null) {
           item.product = { 
            _id: "deleted-" + item._id, 
            name: item.name || "Product Unavailable", 
            image: item.imageUrl || "/images/sample.jpg",
            price: item.price
          };
        }
        return item;
      });
      res.json(orderObj);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      // Mock payment result for testing
      order.paymentResult = {
        id: req.body.id || 'test_id',
        status: req.body.status || 'success',
        update_time: req.body.update_time || Date.now(),
        email_address: req.body.email_address || 'test@example.com',
      };
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      res.json({ message: "Order removed" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};