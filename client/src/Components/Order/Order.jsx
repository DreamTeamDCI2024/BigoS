import PropTypes from 'prop-types';
import { useState } from 'react';
import { createOrder } from './createOrder.jsx';
import axiosInstance from "../../Context/axiosInstanse.jsx";
import { loadStripe } from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import Checkout from '../Checkout/Checkout.jsx';

const stripePromise = loadStripe('pk_test_51Ps9oxKc6TGOcmdDNqRgGIDY0qTbzxgDdqtEQ09ekUFvSMVelQSbaghFthc7OEAbhLGLfGWtiETwNYsnW6ZZw8zF00B0pHn5TU');

const Order = ({ orderItems, totalPrice, closeModal }) => {
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    zip: '',
    country: '',
    houseNumber: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [orderStatus, setOrderStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null); // To store client secret for Stripe

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const order = {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice: 10, 
      shippingPrice: 5, 
      totalPrice: totalPrice + 15
    };

    try {
      const createdOrder = await createOrder(order);
      setOrderStatus('Order created successfully. Proceeding to payment...');
      console.log('Created order:', createdOrder);
      
      const paymentIntentResponse = await axiosInstance.post('/api/payments/create', {
        orderId: createdOrder._id,
        amount: createdOrder.totalPrice * 100, // Stripe expects amount in cents
        currency: 'usd',
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const { clientSecret } = paymentIntentResponse.data;
      setClientSecret(clientSecret); // Set the client secret for the Checkout component
    } catch (error) {
      console.error('Error creating order:', error);
      setOrderStatus(`Error: ${error.response?.data?.message || 'Unable to create order'}`);
    } finally {
      setIsLoading(false);
    }
  };
  Order.propTypes = {
    orderItems: PropTypes.array.isRequired,
    totalPrice: PropTypes.number.isRequired, 
    closeModal: PropTypes.func.isRequired 
  };

  return (
    <div className="order">
      <h2>Create Order</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <h3>Shipping Address</h3>
          <input
            type="text"
            name="street"
            value={shippingAddress.street}
            onChange={handleInputChange}
            placeholder="Street"
            required
          />
          <input
            type="text"
            name="number"
            value={shippingAddress.houseNumber}
            onChange={handleInputChange}
            placeholder="House №"
            required
          />
          <input
            type="text"
            name="city"
            value={shippingAddress.city}
            onChange={handleInputChange}
            placeholder="City"
            required
          />
          <input
            type="text"
            name="zip"
            value={shippingAddress.zip}
            onChange={handleInputChange}
            placeholder="ZIP Code"
            required
          />
          <input
            type="text"
            name="country"
            value={shippingAddress.country}
            onChange={handleInputChange}
            placeholder="Country"
            required
          />
        </div>
        <div>
          <h3>Payment Method</h3>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
          </select>
        </div>
        <div>
          <h3>Order Summary</h3>
          <p>Total: ${totalPrice}</p>
          <p>Tax: $10</p>
          <p>Shipping: $5</p>
          <p>Grand Total: ${totalPrice + 15}</p>
        </div>
        <button type="submit" disabled={isLoading || clientSecret}>
          {isLoading ? 'Processing...' : 'Place Order'}
        </button>
      </form>
      {orderStatus && <p className={orderStatus.includes('Error') ? 'error' : 'success'}>{orderStatus}</p>}

      {clientSecret && (
        <Elements stripe={stripePromise}>
          <Checkout clientSecret={clientSecret} closeModal={closeModal} />
        </Elements>
      )}
    </div>
  );
};

export default Order;