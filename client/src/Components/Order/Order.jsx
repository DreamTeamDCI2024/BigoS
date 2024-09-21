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
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; 

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

  const taxRate = 0.2; 
  const taxPrice = totalPrice ? Math.floor(totalPrice * taxRate * 100) / 100 : 0;
  const shippingPrice = totalPrice < 500 ? 50 : 0;
  const grandTotal = totalPrice ? (Number(totalPrice) + Number(shippingPrice)).toFixed(2) : 0;

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
  const handlePhoneChange = (value) => {
    setShippingAddress(prev => ({ ...prev, phone: value }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

   
    const order = {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice: taxPrice || 0,   // fallback to 0
      shippingPrice: shippingPrice || 0,  // fallback to 0
      totalPrice: grandTotal || 0,  // fallback to 0

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
          <PhoneInput
          country={'us'}
          value={shippingAddress.phone}
          onChange={handlePhoneChange}
          inputStyle={{ width: '93%' }}
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
          <p>Tax(incl.): ${taxPrice.toFixed(2)}</p>
          <p>Shipping: ${shippingPrice}</p>
          <p>Grand Total: ${grandTotal}</p>
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
/*
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
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; 

const stripePromise = loadStripe('pk_test_51Ps9oxKc6TGOcmdDNqRgGIDY0qTbzxgDdqtEQ09ekUFvSMVelQSbaghFthc7OEAbhLGLfGWtiETwNYsnW6ZZw8zF00B0pHn5TU');

const Order = ({ orderItems, totalPrice, closeModal }) => {
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    zip: '',
    country: '',
    houseNumber: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [orderStatus, setOrderStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null); // To store client secret for Stripe
  const [error, setError] = useState(null);

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
        setError('Failed to load user profile. Please try again later.');
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };
  const handlePhoneChange = (value) => {
    setShippingAddress(prev => ({ ...prev, phone: value }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    const order = {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice: 0, 
      shippingPrice: 50, 
      totalPrice: parseFloat((totalPrice + 50).toFixed(2)) // Ensure totalPrice is a number with 2 decimal places
    };
  
    try {
      const createdOrder = await createOrder(order);
      setOrderStatus('Order created successfully. Proceeding to payment...');
      console.log('Created order:', createdOrder);
      
      const paymentIntentResponse = await axiosInstance.post('/api/payments/create', {
        orderId: createdOrder._id,
        amount: order.totalPrice,
        currency: 'usd',
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      const { clientSecret } = paymentIntentResponse.data;
      setClientSecret(clientSecret);
    } catch (error) {
      console.error('Error in order process:', error);
      setError(error.response?.data?.message || 'An error occurred while processing your order. Please try again.');
      setOrderStatus('Failed to process order');
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
      {error && <p className="error-message">{error}</p>}
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
          <PhoneInput
          country={'us'}
          value={shippingAddress.phone}
          onChange={handlePhoneChange}
          inputStyle={{ width: '93%' }}
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

export default Order;*/