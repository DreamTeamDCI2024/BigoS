import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { createOrder } from './createOrder.jsx';
import axiosInstance from "../../Context/axiosInstanse.jsx";
import { loadStripe } from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import Checkout from '../Checkout/Checkout.jsx';
import './Order.css';
import visa from '../../Assets/visa_payment_method_card_icon_142729.webp';
import masterCard from '../../Assets/MasterCard.png';
import paypal from '../../Assets/Paypal.png';
import CustomDropdown from './CustomDropdown.jsx';

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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axiosInstance.get('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const userData = response.data;
        setShippingAddress({
          name: userData.name || '',
          phone: userData.phone || '',
          email: userData.email || '',
          street: userData.street || '',
          city: userData.city || '',
          zip: userData.zip || '',
          country: userData.country || '',
          houseNumber: userData.apartment || '', // Assuming "apartment" is the house number
        });
      } catch (error) {
        console.error('Error fetching user profile:', error.response?.data || error.message);
      }
    };

    fetchUserProfile();
  }, []);

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
      taxPrice: 0, 
      shippingPrice: 50, 
      totalPrice: totalPrice + 50
    };

    try {
      const createdOrder = await createOrder(order);
      setOrderStatus('Proceeding to payment...');
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

  // Payment options with custom content
  const paymentOptions = [
    { value: 'Credit Card', label: <div className='credit-card'><p>Credit Card</p><div className='creditcard-images'><img src={visa} alt="visa" /><img src={masterCard} alt="mastercard" /></div></div> },
    { value: 'PayPal', label: <div className='credit-card'><p>Pay Pal</p><img src={paypal} alt="visa" /></div> }
  ];

  
  Order.propTypes = {
    orderItems: PropTypes.array.isRequired,
    totalPrice: PropTypes.number.isRequired, 
    closeModal: PropTypes.func.isRequired 
  };

  return (
    <div className="order">
      <h2>Create Order</h2>
      <form onSubmit={handleSubmit}>
        <div className='shipping'>
          <h4>Shipping</h4>
          <input
            type="text"
            name="name"
            value={shippingAddress.name}
            onChange={handleInputChange}
            placeholder="Name"
            required
          />
          <input
            type="text"
            name="surname"
            
            onChange={handleInputChange}
            placeholder="Surname"
            required
          />
          <input
            type="text"
            name="phone"
            value={shippingAddress.phone}
            onChange={handleInputChange}
            placeholder="Phone"
            required
          />
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
            name="houseNumber"
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
          <input
            type="text"
            name="email"
            value={shippingAddress.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
        </div>
        <div className='payment'>
          <h4>Payment Method</h4>
          <CustomDropdown
            options={paymentOptions}
            selectedValue={paymentMethod}
            onChange={setPaymentMethod}
          />
          
        </div>
        <div className='order-summary'>
          <h2>Order Summary</h2>
          
          <p>Total: ${totalPrice}</p>
          <p>Tax: $0</p>
          <p>Shipping: $50</p>
          <p>Grand Total: ${totalPrice + 50}</p>
        </div>
        <button className='pay' type="submit" disabled={isLoading || clientSecret}>
          {isLoading ? 'Processing...' : 'Proceed to checkout'}
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