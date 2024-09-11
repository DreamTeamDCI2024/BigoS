import { useTransform, motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react';
import './ArrowButton.css';

const ArrowButton = ({ scrollYProgress }) => {
    const xPosition = useTransform(scrollYProgress, [0.99, 1], ['-150%', '0%']);

  return (
    <motion.div
    style={{
      x: xPosition,
    }}
    className="arrowButtonContainer"
  >
    <motion.button
      className="arrowButton"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        // Here the logic to move to Rooms-Gallery
        console.log('Navegar a otra página');
      }}
    >
      Gallery<ChevronRight size={38} className="arrowIcon" />
    </motion.button>
  </motion.div>
  )
}
export default ArrowButton