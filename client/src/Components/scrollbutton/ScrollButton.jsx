import { useEffect, useState } from 'react';
import './ScrollButton.css'; 

const ScrollButton = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsVisible(false); 
    } else {
      setIsVisible(true); 
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`scrollBtn ${!isVisible ? 'move' : ''}`} id="scrollBtn">
      <span></span>
      <h6>Scroll Down</h6>
    </div>
  );
};

export default ScrollButton;
