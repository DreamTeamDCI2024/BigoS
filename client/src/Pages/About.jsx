import './CSS/About.css';
import { Link } from 'react-router-dom';
import balcony from '../Assets/Balcony.webp';
import bathroom from '../Assets/BathRoom.webp';
import bedroom from '../Assets/BedRoom3.webp';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faInstagram, faFacebook, faPinterestP, faYoutube, faTiktok   } from "@fortawesome/free-brands-svg-icons";

const About = () => {
    
    return (
        <div className='about-wrap'>
            <div className="about-first">
                <div className="modal-about">
                    <h1>Imagine the Potential of Your Interior</h1>
                    <p>Scroll</p>
                </div>
            </div>
            <div className='about-second'>
                <h2>Welcome to the Furniture Gallery</h2>
                <p>Your one-stop shop for stylish furniture and decor, delivering the latest trends exclusively across Europe.</p>
                <div className="about-second-gallery">
                <Link to={`/shop/balcony`}><img src={balcony} alt="" /></Link>
                <Link to={`/shop/bathroom`}><img src={bathroom} alt="" /></Link>
                <Link to={`/shop/bedroom`}><img src={bedroom} alt="" /></Link>
                </div>
            </div>
            <div className='about-third'>
                <h2>Seamless Delivery Across Europe</h2>
                <h4>Enjoy swift and dependable delivery across Europe, bringing your stylish furniture and decor right to your doorstep. We ensure a smooth and timely experience from our store to your home.</h4>
                <div className="about-third-delivery">
                    <div>
                        <p>Purchase:
                        Experience a hassle-free purchasing process with our easy-to-use platform. Select your favorite items and complete your order in just a few clicks, ensuring a smooth and efficient shopping experience.</p>
                    </div>
                    <div>
                        <p>Delivery:
                        Our swift and reliable delivery service ensures your products reach you promptly across Europe. Enjoy a seamless delivery process with timely updates and careful handling of your items from our store to your doorstep.</p>
                    </div>
                    <div>
                    <p>Warranty:
                    We offer a comprehensive warranty on all our products, giving you peace of mind and confidence in your purchase. Should any issues arise, our dedicated support team is here to assist you and ensure your satisfaction.</p>
                    </div>
                </div>
            </div>
            <div className='about-fourth'>
                <h2>Follow Us on Social</h2>
                <div className='follow'>
                    <FontAwesomeIcon className='footer-icons' icon={faInstagram} />
                    <FontAwesomeIcon className='footer-icons' icon={faFacebook} />
                    <FontAwesomeIcon className='footer-icons' icon={faPinterestP} />
                    <FontAwesomeIcon className='footer-icons' icon={faYoutube} />
                    <FontAwesomeIcon className='footer-icons' icon={faTiktok} />
        
                </div>
            </div>
        </div>
    )
}

export default About;