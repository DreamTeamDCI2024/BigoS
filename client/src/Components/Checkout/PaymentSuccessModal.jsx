import PropTypes from 'prop-types';
import '../Order/Order.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const PaymentSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Payment Successful!</h2>
        <p>Your payment was processed successfully. Thank you for your purchase!</p>
        <button onClick={onClose}><FontAwesomeIcon icon={faCheck} /></button>
      </div>
    </div>
  );
};

PaymentSuccessModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PaymentSuccessModal;