import './Footer.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import {faInstagram, faGithub, faFacebook } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <div className="footer">
        <div className='footer-links'>
        <Link to="/shop/all-products"><button>All Products</button></Link>
        <Link to='/contact'><button>Contacts</button></Link>
        <button>Admin</button>
        </div>
        <div className='footer-central'>
            <p>&#169;Blablabla</p>
        </div>
        <div className="footer-icons">
        <FontAwesomeIcon className='footer-icons' icon={faInstagram} />
        <FontAwesomeIcon className='footer-icons' icon={faGithub} />
        <FontAwesomeIcon className='footer-icons' icon={faFacebook} />
        </div>
    </div>
  )
}

export default Footer