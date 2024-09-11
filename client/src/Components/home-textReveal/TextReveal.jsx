import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import TitleFragment from './TitleFragment';
import './TextReveal.css';

const TextReveal = ({ titleA, titleB, titleC, description, progress}) => {
    
    const descriptionClipProgress = useTransform(progress, [0.5, 0.7], [100, 0]);
    const descriptionClip = useMotionTemplate`inset(0 ${descriptionClipProgress}% 0 0)`;      
    const descriptionOpacity = useTransform(progress, [0.5, 0.7], [0, 1]);

    return (
      <div className="text-reveal-container">   
        <div className="titles-column">
        <TitleFragment title={titleA} progress={progress} delay={0}/>
         <TitleFragment title={titleB} progress={progress} delay={0.15}/>
         <TitleFragment title={titleC} progress={progress} delay={0.3}/>
        </div>
        <motion.p 
          className='description-column'
          style={{
            clipPath: descriptionClip,
            opacity: descriptionOpacity,
          }}
        >
          {description}
        </motion.p>      
      </div>
    );
  };

  export default TextReveal;