import Lenis from '@studio-freight/lenis';
import { useEffect } from 'react';

const SmoothScrollProvider = ({ children }) => {
    useEffect(() => {
      // Initialize Lenis smooth scroll
      const lenis = new Lenis({
        duration: 4.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: true,
        touchMultiplier: 2,
        infinite: false,
      });
  
      // Recursive function to update Lenis on each animation frame
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
  
      // Start the animation loop
      requestAnimationFrame(raf);
  
      // Cleanup function to destroy Lenis instance on component unmount
      return () => {
        lenis.destroy();
      };
    }, []);
  
    // Render children components
    return <>{children}</>;
  };
  
  export default SmoothScrollProvider;