import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import rooms from '../../utils/rooms';
import './RoomPreview.css';
const RoomPreview = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % rooms.length);
    }, 3000); // Cambia la imagen cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="room-preview">
      <AnimatePresence>
        {rooms.map((room, index) => (
          activeIndex === index && (
            <motion.div
              key={room.name}
              className="room-images"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <picture>
                <source media="(max-width: 600px)" srcSet={room.images.small} />
                <source media="(max-width: 1200px)" srcSet={room.images.medium} />
                <img src={room.images.large} alt={room.name} />
              </picture>
            </motion.div>
          )
        ))}
      </AnimatePresence>
      <div className="room-navigation">
        {rooms.map((room, index) => (
          <Link key={room.name} to={room.link}>
            <button
              className={index === activeIndex ? 'active' : ''}
              onClick={() => setActiveIndex(index)}
            >
              {room.name}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RoomPreview;