import PropTypes from 'prop-types';
import { useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { ShopContext } from "../../Context/ShopContext.jsx";
import './WishlistItems.css';

const WishlistItems = ({ products = [] }) => {
  const { addToCart, removeFromWishlist } = useContext(ShopContext);

  const handleButtonAddToCart = (productId, productName) => {
    addToCart(productId);
    alert(`${productName} has been added to your cart!`);
  };

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="empty-wishlist">
        <p>Your wishlist is empty.</p>
        <Link to="/shop/all-products" className="shop-link">Go to Shop</Link>
      </div>
    );
  }

  return (
    <div className='wishlist-items'>
      {products.map((product) => {
        if (!product || typeof product !== 'object') {
          return null; // Skip invalid products
        }
        return (
          <div key={product._id} className="wishlist-format">
            <Link to={`/products/${product._id}`}>
              <img 
                src={product.images?.[0]?.product?.[0]?.url || ''} 
                alt={product.name || 'Product'} 
                className="whishlisticon-product-icon" 
              />
            </Link>
            <p>{product.name || 'Unnamed Product'}</p>
            <p>${product.price || 'N/A'}</p>
            <div className='wishlist-items-btns'>
              <button onClick={() => handleButtonAddToCart(product._id, product.name)}>ADD to cart</button>
              <FontAwesomeIcon 
                className="whishlistitems-remove" 
                icon={faXmark} 
                onClick={() => removeFromWishlist(product._id)} 
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
WishlistItems.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    price: PropTypes.number,
    images: PropTypes.arrayOf(PropTypes.shape({
      product: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string
      }))
    }))
  }))
};

export default WishlistItems;