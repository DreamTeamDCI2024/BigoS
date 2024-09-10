import { useContext, useEffect, useState } from 'react';
import './ProductDisplay.css';
import { ShopContext } from '../../Context/ShopContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../Context/axiosInstanse.jsx';
import Breadcrumb from '../Breadcrumb/Breadcrumb.jsx';

const ProductDisplay = () => {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const {addToCart, toggleWishlist, wishlistItems} = useContext(ShopContext);
    const [mainImage, setMainImage] = useState('');

    const handleButtonAddToCart = ()=> {
        addToCart(product._id);
        console.log(`${product.name} added to cart`);
    }

    useEffect(() => {
        const fetchProduct = async () => {
            try{
                const response = await axiosInstance.get(`/api/products/${id}`);
                setProduct(response.data);

                console.log('Product images:', response.data.images);

                if(response.data.images && response.data.images.length > 0){
                    setMainImage(response.data.images[0].product[0].url);
                }else {
                    console.warn('No images')
                }
            } catch(error){
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [id]);
    if (!product){
        return <div>Loading...</div>
    }
    const isWishlisted = wishlistItems[product._id] || false;

    const handleImageClick = (url) => {
        setMainImage(url);
    }
  return (
    <div>
    <Breadcrumb product={product} />
    <div className='product-display'>
        <div className="product-display-left">
            <div className='product-display-img-list'>
                {product.images[0]?.product.map((img, index) => (
                    <img key={index} src={img.url} alt={`Product ${index}`} onClick={() => handleImageClick(img.url)}/>
                ))}
            </div>
        </div>
        <div className="product-display-img">
            <img className='product-display-main' src={mainImage || 'path/to/placeholder-image.jpg'} alt={product.name}/>
            {!mainImage && <p>No image</p>}
        </div>
        <div className="product-display-right">
            <h1>{product.name}</h1>
            <div className="product-display-price">Price: ${product.price}</div>
            <div className='product-display-materials'>Materials: {product.materials}</div>
            <div className='product-categories'>Categories: {product.categories.join(', ')}</div>
            <div className="product-display-description"><p>{product.description}</p></div>
            <div className='product-display-room'>Room: {product.room}</div>
                    <div className='product-display-dimensions'>
                        Dimensions: {product.dimensions.length}L x {product.dimensions.width}W x {product.dimensions.height}H cm
                    </div>
                    <div className="product-display-description"><p>{product.description}</p></div>
                    <div className="product-display-stock">In Stock: {product.stock}</div>
            <div className="adding">
                <button className='cart-btn' onClick={handleButtonAddToCart}>Add to cart</button>
                <button className='wishlist-btn' onClick={()=> toggleWishlist(product._id)}>
                    <FontAwesomeIcon color={isWishlisted ? 'red' : 'black'} icon={faHeart}/>
                </button>
            </div>

        </div>
    </div>
    </div>
  )
}


export default ProductDisplay;