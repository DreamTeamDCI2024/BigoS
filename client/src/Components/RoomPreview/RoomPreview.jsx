import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import rooms from '../../utils/rooms';

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
      {/* <h2>Explore Our Rooms</h2> */}
      <div className="room-images">
        {rooms.map((room, index) => (
          <motion.div
            key={room.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === activeIndex ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
           <picture>
             <source media="(max-width: 600px)" srcSet={room.images.small} />
             <source media="(max-width: 1200px)" srcSet={room.images.medium} />
             <img src={room.images.large} alt={room.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
           </picture>
          </motion.div>
        ))}
      </div>
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