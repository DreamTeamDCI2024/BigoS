import { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { useScroll } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import ScrollMagic from 'scrollmagic';
import ArrowButton from '../home-textReveal/ArrowButton'
import RoomSlides from '../room-slides/RoomSlides';
import './Gallery.css';

function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

const Gallery = ({ products, roomData }) => {
  const { scrollYProgress } = useScroll();
  const preloaderRef = useRef(null);
  const firstTextRef = useRef(null);
  const secondTextRef = useRef(null);
  const loaderVideoRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  // State to manage selected images
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    // Smooth scroll Lenis 
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
      // console.log(products);
    }
    requestAnimationFrame(raf);

    // Scroll Indicator functionality
    const handleScroll = () => {
      if (scrollIndicatorRef.current) {
        if (window.scrollY > 0) {
          scrollIndicatorRef.current.style.opacity = '0';
        } else {
          scrollIndicatorRef.current.style.opacity = '1';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    
    const preloader = preloaderRef.current;
    const firstText = firstTextRef.current;
    const secondText = secondTextRef.current;

    firstText.style.opacity = '1';

    const firstTimeout = setTimeout(() => {
      firstText.style.opacity = '0';
      secondText.style.opacity = '1';
    }, 1000);

    const secondTimeout = setTimeout(() => {
      preloader.style.display = 'none';
    }, 4000);
    
    // loading video
    document.body.classList.add('overflow-hidden');

    const thirdTimeout = setTimeout(() => {
      const loaderVideo = loaderVideoRef.current;
      loaderVideo.style.width = '90%';
      loaderVideo.style.height = '90%';
      loaderVideo.style.transform = 'translate(-50%, -50%)';
      loaderVideo.style.top = '50%';
      loaderVideo.style.left = '50%';
      loaderVideo.style.position = 'fixed';
      loaderVideo.style.borderRadius = '12px';
    }, 2000);

    const fourthTimeout = setTimeout(() => {
      const loaderVideo = loaderVideoRef.current;
      if (window.matchMedia('(max-width: 576px)').matches) {
        loaderVideo.style.width = '220px';
        loaderVideo.style.height = '220px';
        loaderVideo.style.top = '25%';
        loaderVideo.style.left = '24px';
        loaderVideo.style.right = 'auto';
        loaderVideo.style.transform = 'translate(0%, -25%)';
      } else if (window.matchMedia('(max-width: 767px)').matches) {
        loaderVideo.style.width = '220px';
        loaderVideo.style.height = '220px';
        loaderVideo.style.left = 'auto';
        loaderVideo.style.right = '40px';
        loaderVideo.style.transform = 'translate(0%, -50%)';
      } else if (window.matchMedia('(max-width: 991px)').matches) {
        loaderVideo.style.width = '310px';
        loaderVideo.style.height = '310px';
        loaderVideo.style.left = 'auto';
        loaderVideo.style.right = '40px';
        loaderVideo.style.transform = 'translate(0%, -50%)';
      } else if (window.matchMedia('(max-width: 1199px)').matches) {
        loaderVideo.style.width = '400px';
        loaderVideo.style.height = '400px';
        loaderVideo.style.left = 'auto';
        loaderVideo.style.right = '60px';
        loaderVideo.style.transform = 'translate(0%, -50%)';
      } else if (window.matchMedia('(max-width: 1399px)').matches) {
        loaderVideo.style.width = '450px';
        loaderVideo.style.height = '450px';
        loaderVideo.style.left = 'auto';
        loaderVideo.style.right = '80px';
        loaderVideo.style.transform = 'translate(0%, -50%)';
      } else {
        loaderVideo.style.width = '500px';
        loaderVideo.style.height = '500px';
        loaderVideo.style.top = '50%';
        loaderVideo.style.left = 'auto';
        loaderVideo.style.right = '100px';
        loaderVideo.style.transform = 'translate(0%, -50%)';
        loaderVideo.style.position = 'absolute';
      }
      document.body.classList.remove('overflow-hidden');
    }, 3000);

    // Setting scrollmagic when the comp. are loaded
    const controller = new ScrollMagic.Controller({ loglevel: 3 });
    new ScrollMagic.Scene({
      triggerElement: '#section2',
      triggerHook: 'onEnter',
      duration: '100%',
    })
      .setPin('#section1 .pinWrapper', {
        pushFollowers: false,
      })
      .addTo(controller);

    new ScrollMagic.Scene({
      triggerElement: '#section2',
      triggerHook: 'onEnter',
      duration: '200%',
    })
      .setPin('#section2 .pinWrapper', {
        pushFollowers: false,
      })
      .addTo(controller);

    new ScrollMagic.Scene({
      triggerElement: '#section3',
      triggerHook: 'onEnter',
      duration: '200%',
    })
      .setPin('#section3 .pinWrapper', {
        pushFollowers: false,
      })
      .addTo(controller);

    new ScrollMagic.Scene({
      triggerElement: '#section4',
      triggerHook: 'onEnter',
      duration: '100%',
    })
      .setPin('#section4 .pinWrapper', {
        pushFollowers: false,
      })
      .addTo(controller);

       // Initialize selectedImages with images from the first product
  if (products && products.length > 0) {
    const firstProduct = products[0];
    let imagesArray = [];

    if (firstProduct.images) {
      // Collect all images from 'product', 'transparent', and 'contextual'
      ['product', 'transparent', 'contextual'].forEach((key) => {
        if (firstProduct.images[key] && firstProduct.images[key].length > 0) {
          firstProduct.images[key].forEach((imageObj) => {
            if (imageObj.url) {
              imagesArray.push(imageObj.url);
            }
          });
        }
      });
    }

    // Split imagesArray into chunks (pages) of 3 images each
    const imagesChunks = chunkArray(imagesArray, 4);

    // Update the selected images state
    setSelectedImages(imagesChunks);
    }

    // Clean
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(firstTimeout);
      clearTimeout(secondTimeout);
      clearTimeout(thirdTimeout);
      clearTimeout(fourthTimeout);
      controller.destroy(true);
    };
  }, [products]);

    // Handle image click
  const handleImageClick = (product) => {
      const imagesArray = [];
      if (product.images) {
        ['product', 'transparent', 'contextual'].forEach((key) => {
          if(product.images[key] && product.images[key].length > 0) {
            product.images[key].forEach((imageObj) => {
              if(imageObj.url) {
                imagesArray.push(imageObj.url);
              }
            });
          }        
        });
      }
     // Split imagesArray into chunks (pages) of 3 images each
      const imagesChunks = chunkArray(imagesArray, 3);
    
      setSelectedImages(imagesChunks);
    };

  return (
    <div className='main-container'>
        <section className="events-page">
        <div id="section1" 
             className="event" 
             style={{ backgroundImage: `url(${roomData.imageSrc})` }}
        >
          <div className="pinWrapper">
            <div className="text">
              <h2>{roomData ? roomData.roomName : ''}</h2>
              <p>{roomData ? roomData.preloaderSubtitle : ''}</p>
            </div>
            <div className="image" id="loaderVideo" ref={loaderVideoRef}>
              <video autoPlay loop muted playsInline>
                <source src={roomData.videoSrc} type="video/mp4" />
              </video>
            </div>
          </div>
          <div className="scrollBtn" ref={scrollIndicatorRef}>
            <h6>scroll</h6>
            <span></span>
          </div>
        </div>
        {products.slice(0,3).map((product, index) => {
          let productImageUrl = '';
          let backgroundImageUrl = '';
          
          // Accessing product images
          if (
            product.images &&
            product.images.product &&
            product.images.product.length > 0 &&
            product.images.product[0].url 
          ) {
            productImageUrl = product.images.product[0].url;
          } else {
            // default image
            productImageUrl = '/images/LivingRoom/LivingRoom-small.webp';
          }

          // Accessing background images
          if (
            product.images &&
            product.images.contextual &&
            product.images.contextual.length > 0 &&
            product.images.contextual[1].url
          ) {
            backgroundImageUrl = product.images.contextual[1].url;
          }
          return (
            <div 
            id={`section${index + 2}`} 
            className="event" 
            key={product._id}
            style={backgroundImageUrl 
                ? { backgroundImage: `url(${backgroundImageUrl})` } 
                : {}
              }
            >
            <div className="pinWrapper">
              <div className="text">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
              </div>
              <div
                className="image"
                style={{ backgroundImage: `url(${productImageUrl})` }}
                onClick={() => handleImageClick(product)} //adding the click handler
              ></div>
            </div>          
          </div>                   
          );       
        })}
        
      </section>
      <div className='slides-container'>
        <RoomSlides images={selectedImages} progress={scrollYProgress} />
        <Link to="/gallery">
         <ArrowButton scrollYProgress={scrollYProgress} />
        </Link>
      </div>
      {/* Loader */}
      <div id="preloader" ref={preloaderRef}>
        <div className="text-wrapper">
          <h1 id="first-text" ref={firstTextRef}>
          {roomData ? roomData.preloaderTitle1 : ''}
          </h1>
          <h3 id="second-text" ref={secondTextRef}>
          {roomData ? roomData.preloaderTitle2 : ''}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default Gallery;