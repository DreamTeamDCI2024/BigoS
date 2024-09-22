import "./CSS/About.css";
import { Link } from "react-router-dom";
import balcony from "../Assets/Balcony.webp";
import bathroom from "../Assets/BathRoom.webp";
import bedroom from "../Assets/BedRoom3.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebook,
  faPinterestP,
  faYoutube,
  faTiktok
} from "@fortawesome/free-brands-svg-icons";
import { faArrowDown} from "@fortawesome/free-solid-svg-icons";
import delivery from "../Assets/product-delivery_17627372.png";
import cart from "../Assets/purchase.png";
import guarantee from "../Assets/guarantee.png";

const About = () => {
  return (
    <div className="about-wrap">
      <div className="about-first">
        <div className="modal-about">
          <h1>Imagine the Potential of Your Interior</h1>
          <p>Scroll</p>
          <FontAwesomeIcon icon={faArrowDown} className="arrow bounce"/>
        </div>
      </div>
      <div className="about-second">
        <h2>Welcome to the Furniture Gallery</h2>
        <p>
          Your one-stop shop for stylish furniture and decor, delivering the
          latest trends exclusively across Europe.
        </p>
        <div className="about-second-gallery">
          <Link to={`/shop/balcony`}>
            <div className="gallery-item">
              <img src={balcony} alt="Balcony" />
              <p>Balcony</p>
            </div>
          </Link>
          <Link to={`/shop/bathroom`}>
            <div className="gallery-item">
              <img src={bathroom} alt="Bathroom" />
              <p>Bathroom</p>
            </div>
          </Link>
          <Link to={`/shop/bedroom`}>
            <div className="gallery-item">
              <img src={bedroom} alt="Bedroom" />
              <p>Bedroom</p>
            </div>
          </Link>
        </div>
      </div>
      <div className="about-third">
        <h2>Seamless Delivery Across the World</h2>
        <h4>
          Enjoy swift and dependable delivery across the World, bringing your
          stylish furniture and decor right to your doorstep. We ensure a smooth
          and timely experience from our store to your home.
        </h4>
        <div className="about-third-delivery">
          <div className="delivery">
            <img src={cart} alt="" className="delivery-img" />
            <p>
              <strong>Purchase: </strong>
              Experience a hassle-free purchasing process with our easy-to-use
              platform. Select your favorite items and complete your order in
              just a few clicks, ensuring a smooth and efficient shopping
              experience.
            </p>
          </div>
          <div className="delivery">
            <p>
              <strong>Delivery:</strong>
              Our swift and reliable delivery service ensures your products
              reach you promptly across the World. Enjoy a seamless delivery
              process with timely updates and careful handling of your items
              from our store to your doorstep.
            </p>
            <img src={delivery} alt="" className="delivery-img" />
          </div>
          <div className="delivery">
            <img src={guarantee} alt="" className="delivery-img" />
            <p>
              <strong>Warranty:</strong>
              We offer a comprehensive warranty on all our products, giving you
              peace of mind and confidence in your purchase. Should any issues
              arise, our dedicated support team is here to assist you and ensure
              your satisfaction.
            </p>
          </div>
        </div>
      </div>
      <div className="about-fourth">
        <h2>Follow Us on Social</h2>
        <div className="follow">
          <FontAwesomeIcon
            className="footer-icons instagram"
            icon={faInstagram}
          />
          <FontAwesomeIcon
            className="footer-icons facebook"
            icon={faFacebook}
          />
          <FontAwesomeIcon
            className="footer-icons pinterest"
            icon={faPinterestP}
          />
          <FontAwesomeIcon className="footer-icons youtube" icon={faYoutube} />
          <FontAwesomeIcon className="footer-icons tiktok" icon={faTiktok} />
        </div>
      </div>
    </div>
  );
};

export default About;
