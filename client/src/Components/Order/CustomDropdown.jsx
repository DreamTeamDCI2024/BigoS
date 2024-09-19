import { useState } from 'react';
//import visa from '../../Assets/visa_payment_method_card_icon_142729.webp';
import './Order.css';

const CustomDropdown = ({ options, selectedValue, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown">
      <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
        {options.find(option => option.value === selectedValue)?.label}
      </div>
      {isOpen && (
        <div className="dropdown-list">
          {options.map(option => (
            <div
              key={option.value}
              className="dropdown-option"
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;