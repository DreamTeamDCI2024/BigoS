import Order from "../models/order.js";


// Function to Create a new order
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    const newOrder = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await newOrder.save();
    res.status(201).json({ message: "Order created successfully", createdOrder });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error creating order" });
  }
};

//Function to Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "username email").populate("orderItems.product", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error fetching order" });
  }
};

// Function to Get all orders for a specific user
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("orderItems.product", "name price");
    res.status(200).json(orders);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error fetching user orders" });
  }
};

// Function to Update order to paid
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.status(200).json({ message: "Order paid successfully", updatedOrder });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error updating order to paid" });
  }
};

// Function to Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.remove();
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error deleting order" });
  }
};

// Function to Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json({ message: "Order status updated successfully", updatedOrder });
  } catch (error) {
    return res.status(500).json({ message: "Error updating order status", error });
  }
};
