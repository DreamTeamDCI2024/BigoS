import { useContext } from 'react';
import './Item.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart} from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart} from '@fortawesome/free-solid-svg-icons';
import { ShopContext } from '../../Context/ShopContext.jsx';

const Item = (product) => {
 
  const {addToCart, toggleWishlist, wishlistItems} = useContext(ShopContext);

  const handleButtonAddToCart = ()=> {
    addToCart(product.id);
    console.log(`${product.name} added to cart`);
    
  }
  

  const isWishlisted = wishlistItems[product.id] || false;

  
  return (
    <div className='item'>
        <Link to={`/products/${product.id}`}><img src={product.image} alt="" /></Link>
        <p>{product.name}</p>
        <div className="price">${product.price}</div>
        <div className='adding-item'>
          <button className='add-to-cart' onClick={handleButtonAddToCart}>Add to cart</button>
          <FontAwesomeIcon className='add-to-wishlist' icon={isWishlisted ? fasHeart : farHeart } onClick={()=> toggleWishlist(product.id)} />
        </div>
    </div>
  )
}

export default Item;