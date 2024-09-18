import { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext.jsx';
import WishlistItems from '../Components/WishlistItems/WishlistItems.jsx';
import axiosInstance from '../Context/axiosInstanse.jsx';
import './CSS/Wishlist.css';

const Wishlist = () => {
  const { wishlistItems } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Axios error:', error);
        setError('Error fetching products: ' + (error.response?.data?.message || error.message));
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    console.log('wishlistItems:', wishlistItems);
    console.log('products:', products);
  }, [wishlistItems, products]);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  const wishlistProducts = [];
  if (wishlistItems && products.length > 0) {
    for (const id in wishlistItems) {
      if (wishlistItems[id]) {
        const product = products.find(p => p && p._id === id);
        if (product) {
          wishlistProducts.push(product);
        }
      }
    }
  }

  return (
    <div className="wishlist">
      <WishlistItems products={wishlistProducts} />
    </div>
  );
};

export default Wishlist;