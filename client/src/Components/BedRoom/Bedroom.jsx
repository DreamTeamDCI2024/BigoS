import { useEffect, useState } from "react";
import axiosInstance from '../../Context/axiosInstanse';
import Lenis from '@studio-freight/lenis';
import { useSpring } from 'framer-motion';
import Gallery from "../productGallery/Gallery";
import roomsData from "../../utils/roomsData";
import './Bedroom.css';

const Bedroom = () => {
  const [roomProducts, setRoomProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductsByRoom = async () => {
      try {
        const response = await axiosInstance.get(`/api/products/room/BedRoom`);
        setRoomProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching products for BedRoom:`, error);
        setError(`Error fetching products for BedRoom`);
        setLoading(false);
      }
    };
  
    fetchProductsByRoom();
  }, []);

  const spring = {
    stiffness: 150,
    damping: 15,
    mass: 0.8
  }
  const mousePosition = {
    x: useSpring(0, spring),
    y: useSpring(0, spring)
  };

  useEffect(() => {
    const lenis = new Lenis()
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, []);

  const mouseMove = (e) => {
    const { clientX, clientY } = e;
    const targetX = clientX - (window.innerWidth / 2 * 0.25);
    const targetY = clientY - (window.innerWidth / 2 * 0.30);
    mousePosition.x.set(targetX);
    mousePosition.y.set(targetY);
  }

  return (
    <main className="about-container" onMouseMove={mouseMove}>     
        {loading ? (
      <div>Loading products...</div>
    ) : error ? (
      <div>{error}</div>
    ) : (
      <Gallery products={roomProducts} roomData={roomsData.Bedroom} />
    )}
    </main>
  )
}

export default Bedroom