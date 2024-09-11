import { useState, useEffect } from 'react';
import axiosInstance from '../../Context/axiosInstanse';
import Item from '../Item/Item';
import './AllProducts.css';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageCategory, setImageCategory] = useState('product');
  const [fadeOut, setFadeOut] = useState(false);
  
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching products. Please try again later.');
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

if (loading) return <div>Loading...</div>;
if (error) return <div>{error}</div>;

const handleCategoryChange = (category) => {
  if (category !== imageCategory) {
    setFadeOut(true);
    setTimeout(() => {
      setImageCategory(category);
      setFadeOut(false);
    }, 200); 
  }
  //setImageCategory(category);
};

  return (
    <div className='all-products'>
        <h1>All Products</h1>
        <div className="image-category-switch">
        <div className="switch-track"></div>
        <button 
          onClick={() => handleCategoryChange('product')}
          className={`switch-circle ${imageCategory === 'product' ? 'active' : ''}`}
          aria-label="Product images"
        ></button>
        <button 
          onClick={() => handleCategoryChange('contextual')}
          className={`switch-circle ${imageCategory === 'contextual' ? 'active' : ''}`}
          aria-label="Contextual images"
        ></button>
        <button 
          onClick={() => handleCategoryChange('transparent')}
          className={`switch-circle ${imageCategory === 'transparent' ? 'active' : ''}`}
          aria-label="Transparent images"
        ></button>
        <div className={`switch-indicator ${imageCategory}`}></div>
      </div>
      <div className={`all-products-item ${fadeOut ? 'fade-out' : 'fade-in'}`}>
        {products.map((product) => (
          <Item 
            key={product._id}
            id={product._id}
            name={product.name}
            image={product.images[imageCategory][0]?.url || 'placeholder-image-url'}
            price={product.price}
          />
        ))}
        </div>
    </div>
  )
}

export default AllProducts;