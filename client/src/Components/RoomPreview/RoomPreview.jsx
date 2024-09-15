import { Canvas } from '@react-three/fiber';
import { useState, useEffect, useMemo, useCallback } from 'react';
import rooms from '../../utils/rooms';
import ImageTransition from '../imageTransition/ImageTransition';
import { Link } from 'react-router-dom';
// import ProductGallery from '../productGallery/ProductGallery';
import './RoomPreview.css';

const getImageSize = () => {
    const width = window.innerWidth;
    if (width < 640) return 'small';
    if (width < 1024) return 'medium';
    return 'large';
  };

function RoomPreview() {
    const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
    const [imageSize, setImageSize] = useState(getImageSize());
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
    const handleResize = () => {
          setImageSize(getImageSize());
    };
    window.addEventListener('resize', handleResize);
         return () => window.removeEventListener('resize', handleResize);
      }, []);

    const images = useMemo(() => rooms.map(room => room.images[imageSize]), [imageSize]);

    const handleTransitionComplete = useCallback((newIndex) => {
     // console.log('Transition complete to index:', newIndex);
      setCurrentRoomIndex(newIndex);
  }, []);

    return (
      <div className="room-preview">
        <Canvas style={{ width: '100%', height: '100vh' }}>
        <ImageTransition 
          images={images} 
          currentIndex={currentRoomIndex}
          onTransitionComplete={handleTransitionComplete}
        />
        </Canvas>
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
  }
  
  export default RoomPreview;
