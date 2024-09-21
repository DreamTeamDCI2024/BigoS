import PropTypes from 'prop-types';
import { useState, useContext } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ShopContext } from '../../Context/ShopContext';
import '../Order/Order.css';
import PaymentSuccessModal from './PaymentSuccessModal';

const Checkout = ({ clientSecret, closeModal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { clearCart } = useContext(ShopContext); 

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const cardElement = elements.getElement(CardElement);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        setPaymentStatus(`Payment failed: ${result.error.message}`);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          setPaymentStatus('Payment successful!');
          

          // Trigger the success modal
          setIsSuccessModalOpen(true);

          setTimeout(() => {
            clearCart();  // Close the modal after successful payment
          }, 5000);
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setPaymentStatus('Error: Unable to process payment.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    closeModal();
  };
  
  Checkout.propTypes = {
    clientSecret: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <form onSubmit={handlePaymentSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe || isLoading}>
          {isLoading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
      {paymentStatus && <p className={paymentStatus.includes('Error') ? 'error' : 'success'}>{paymentStatus}</p>}

      {/* Render the PaymentSuccessModal */}
      <PaymentSuccessModal isOpen={isSuccessModalOpen} onClose={closeSuccessModal} />
     </div>
  );
};

export default Checkout;