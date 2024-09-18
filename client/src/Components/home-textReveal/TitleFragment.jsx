import { motion, useTransform, useMotionTemplate } from "framer-motion";
import './TextReveal.css';

const TitleFragment = ({ title, progress, delay }) => {
    const titleClipProgress = useTransform(
      progress,
      [0.0, 0.75+ delay , 0.9 + delay, 1],
      [100, 0, 0, 0]
    );
    const titleClip = useMotionTemplate`inset(0 ${titleClipProgress}% 0 0)`;
    const titleOpacity = useTransform(
      progress,
      [0, 0.25 , 0.7 , 1],
      [0, 0.25, 0.7, 1]
    );
  
    return (
      <motion.h2
        className="title-fragment"
        style={{
          clipPath: titleClip,
          opacity: titleOpacity,
        }}
      >
        {title}
      </motion.h2>
    );
  };

  export default TitleFragment;