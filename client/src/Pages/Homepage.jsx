import { Link } from "react-router-dom";
import SmoothScrollProvider from '../Components/home-videoScroll/SmoothScrollProvider.jsx';
import WebGPUVideoScrollComponent from "../Components/home-videoScroll/WebGPUVideoScrollComponent.jsx";
import { useScroll, useTransform } from 'framer-motion';
import ArrowButton from '../Components/home-textReveal/ArrowButton';
import TextReveal from '../Components/home-textReveal/TextReveal';
import textData from '../utils/textData';
import '../Pages/CSS/HomePage.css';
import RoomPreview from "../Components/RoomPreview/RoomPreview";

const Homepage = () => {
    const { scrollYProgress } = useScroll();
    return (
    <div className="main">
     <SmoothScrollProvider >
      <WebGPUVideoScrollComponent>
       <div style={{ minHeight: '300vh', padding: '2rem' }}>         
          {textData.map((item, index) => {
            const start = index / textData.length;
            const end = (index + 1) / textData.length;
            const progress = useTransform(scrollYProgress, [start, end], [0, 1]);
            return(
            <TextReveal 
              key={index} 
              titleA={item.titleA} 
              titleB={item.titleB}
              titleC={item.titleC}
              description={item.description} 
              progress={progress}          
            />
            );
           })}
          <Link to="/gallery">
            <ArrowButton scrollYProgress={scrollYProgress} />
          </Link>
        </div>
      </WebGPUVideoScrollComponent>
    </SmoothScrollProvider>
   </div>
    )
}

export default Homepage;