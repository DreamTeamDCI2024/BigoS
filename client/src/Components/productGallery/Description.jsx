import { useState } from 'react';
import { motion } from 'framer-motion';
import './Description.css';

const Description = ({ mousePosition, projects }) => {
  const [index, setIndex] = useState(0);
  const { x, y } = mousePosition;

  return (
    <div className="description-container">
      <div className="description-content">
        {projects.map(({ name }, i) => (
          <p 
            onMouseOver={() => setIndex(i)} 
            key={`p${i}`}
          >
            {name}
          </p>
        ))}
      </div>
      <motion.div
        className="description-image"
        style={{ x, y }}
      >
        <img 
          src={`/images/${projects[index].handle}/about.jpg`}
          alt="About image"
        />
      </motion.div>
    </div>
  );
}

export default Description;