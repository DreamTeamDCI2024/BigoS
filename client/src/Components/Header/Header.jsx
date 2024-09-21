
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCartShopping, faUser, faHeart, } from "@fortawesome/free-solid-svg-icons";
import { ShopContext } from "../../Context/ShopContext.jsx";
import { UserContext } from "../../Context/UserContext.jsx";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const {getTotalCartItems, getTotalWishlistItems} = useContext(ShopContext);
  const {isAuthenticated} = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuItemClick = () => {
    setMenuOpen(false);
  }
  const handleSubmenuToggle = () => {
    setSubMenuOpen(!subMenuOpen);
  }
  const handleUserIconClick = () => {
    console.log("Authenticated", isAuthenticated)
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login', { state: { from: '/profile' } }); // Pass the profile page as state
    }
  };
  
  return (
    <div className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="menu">
        <input id="menu_toggle" type="checkbox" checked={menuOpen} onChange={handleMenuToggle} />
        <label className="menu_btn" htmlFor="menu_toggle">
          <span></span>
        </label>
        <ul className="sidebar">
          <li onClick={() => handleMenuItemClick("about")}><Link to='/about'>About</Link></li>
          <li onClick={handleSubmenuToggle}>
            <Link>Products</Link>
            <div className={`submenu-container ${subMenuOpen ? 'open' : ''}`}>
                <ul className="submenu">
                <li onClick={() => handleMenuItemClick("products")}>
                    <Link to="/shop/all-products">All Products</Link>
                  </li>
                  <li onClick={() => handleMenuItemClick("products")}>
                    <Link to="/shop/living-room">Living room</Link>
                  </li>
                  <li onClick={() => handleMenuItemClick("products")}>
                    <Link to="/shop/balcony">Balcony</Link>
                  </li>
                  <li onClick={() => handleMenuItemClick("products")}>
                    <Link to="/shop/bedroom">Bedroom</Link>
                  </li>
                  <li onClick={() => handleMenuItemClick("products")}>
                    <Link to="/shop/bathroom">Bathroom</Link>
                  </li>
                </ul>
              </div>
          </li>
          <li onClick={() => handleMenuItemClick("contact")}><Link to='/contact'>Contacts</Link></li>
        </ul>
      </div>

      <div className="nav-logo">
        <Link to='/'><button>
          <img className="logo" src="./images/logo5.png
          " alt="" />
        </button></Link>
      </div>

      <div className="nav-login-cart">
        <Link to='/wishlist'>
          <button>
            <FontAwesomeIcon className="nav-icons" icon={faHeart} />
          </button>
        </Link>
        <div className="nav-wishlist-count">{getTotalWishlistItems()}</div>

        <button onClick={handleUserIconClick}>
          <FontAwesomeIcon className="nav-icons" icon={faUser} />
        </button>

        <Link to='/cart'>
          <button>
            <FontAwesomeIcon className="nav-icons" icon={faCartShopping} />
          </button>
        </Link>

        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Header;

/*
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCartShopping, faUser, faHeart, } from "@fortawesome/free-solid-svg-icons";
import { ShopContext } from "../../Context/ShopContext.jsx";
import { UserContext } from "../../Context/UserContext.jsx";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const {getTotalCartItems, getTotalWishlistItems} = useContext(ShopContext);
  const {isAuthenticated} = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuItemClick = () => {
    setMenuOpen(false);
  }
  
  const handleUserIconClick = () => {
    console.log("Authenticated", isAuthenticated)
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login', { state: { from: '/profile' } }); // Pass the profile page as state
    }
  };
  
  return (
    <div className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="menu">
        <input id="menu_toggle" type="checkbox" checked={menuOpen} onChange={handleMenuToggle} />
        <label className="menu_btn" htmlFor="menu_toggle">
          <span></span>
          
        </label>
        <ul className="sidebar">
          <li onClick={() => handleMenuItemClick("about")}><Link to='/about'>About</Link></li>
          <li onClick={() => handleMenuItemClick("all-products")}><Link to="/shop/all-products">All Products</Link></li>
          <li onClick={() => handleMenuItemClick("gallery")}><Link to='/gallery'>Gallery</Link></li>
          <li onClick={() => handleMenuItemClick("contact")}><Link to='/contact'>Contact</Link></li>
        </ul>
      </div>

      <div className="nav-logo">
        <Link to='/'><button>
          <img className="logo" src="./images/logo5.png
          " alt="" />
        </button></Link>
      </div>

      <div className="nav-login-cart">
        <Link to='/wishlist'>
          <button>
            <FontAwesomeIcon className="nav-icons" icon={faHeart} />
          </button>
        </Link>
        <div className="nav-wishlist-count">{getTotalWishlistItems()}</div>

        <button onClick={handleUserIconClick}>
          <FontAwesomeIcon className="nav-icons" icon={faUser} />
        </button>

        <Link to='/cart'>
          <button>
            <FontAwesomeIcon className="nav-icons" icon={faCartShopping} />
          </button>
        </Link>

        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Header;
*/