import Stripe from "stripe";
import Payment from "../models/payment.js";
import Order from "../models/order.js";
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Function to To Create a Payment
export const createPayment = async (req, res) => {
  try {
    const { orderId, amount, currency } = req.body;

    //Function to To Validate the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Function to To Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { orderId: orderId.toString(), userId: req.user.id.toString() },
    });

    // Function to Save the payment details in the database
    const newPayment = new Payment({
      userId: req.user.id,
      orderId,
      amount,
      currency,
      paymentIntentId: paymentIntent.id,
      status: "pending",
    });
    await newPayment.save();

    return res.status(201).json({ message: "Payment initiated", clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return res.status(500).json({ message: "Error creating payment", error });
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
