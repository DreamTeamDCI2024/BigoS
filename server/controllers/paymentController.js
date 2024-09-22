import Stripe from "stripe";
import Payment from "../models/payment.js";
import Order from "../models/order.js";
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Function to To Create a Payment
export const createPayment = async (req, res) => {
  try {
    let { orderId, amount, currency } = req.body;

    if (!orderId || !amount || !currency) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    amount = Math.round(amount * 100);

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { orderId: orderId.toString(), userId: req.user.id.toString() },
    });


    const newPayment = new Payment({
      userId: req.user.id,
      orderId,
      amount,
      currency,
      paymentIntentId: paymentIntent.id,
      status: "pending",
    });
    await newPayment.save();

    return res.status(201).json({ 
      message: "Payment initiated", 
      clientSecret: paymentIntent.client_secret 
    });
  } catch (error) {
    console.error('Error in createPayment:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return res.status(400).json({ 
        message: "Stripe error", 
        error: error.message,
        type: error.type
      });
    }
    
    return res.status(500).json({ 
      message: "Error creating payment", 
      error: error.message 
    });
  }
};

// Function to Handle Payment Webhook (Stripe sends events to this endpoint)
export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return res.status(400).json({ message: `Webhook Error: ${error.message}` });
  }

  // Function to Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      const payment = await Payment.findOne({ paymentIntentId: paymentIntent.id });
      if (payment) {
        payment.status = "completed";
        await payment.save();
      }
      break;
    case "payment_intent.payment_failed":
      const paymentFailed = event.data.object;
      const failedPayment = await Payment.findOne({ paymentIntentId: paymentFailed.id });
      if (failedPayment) {
        failedPayment.status = "failed";
        await failedPayment.save();
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
};
/*
export const createPayment = async (req, res) => {
  try {
    let { orderId, amount, currency } = req.body;

    if (!orderId || !amount || !currency) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    amount = Math.round(amount * 100);

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { orderId: orderId.toString(), userId: req.user.id.toString() },
    });


    const newPayment = new Payment({
      userId: req.user.id,
      orderId,
      amount,
      currency,
      paymentIntentId: paymentIntent.id,
      status: "pending",
    });
    await newPayment.save();

    return res.status(201).json({ 
      message: "Payment initiated", 
      clientSecret: paymentIntent.client_secret 
    });
  } catch (error) {
    console.error('Error in createPayment:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return res.status(400).json({ 
        message: "Stripe error", 
        error: error.message,
        type: error.type
      });
    }
    
    return res.status(500).json({ 
      message: "Error creating payment", 
      error: error.message 
    });
  }
};*/