import { useContext, useState, useEffect } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Order from "../Order/Order.jsx";
import axiosInstance from "../../Context/axiosInstanse.jsx";

const CartItems = () => {
  const { getTotalCartAmount, cartItems, removeFromCart, addToCart, updateCartItemCount } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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

  const openModal = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login page if not authenticated
      navigate('/login');
    } else {
      setIsModalOpen(true);
    }
  };
  const closeModal = () => setIsModalOpen(false);


  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  const orderItems = products
    .filter(product => cartItems[product._id] > 0)
    .map(product => ({
      product: product._id,
      quantity: cartItems[product._id],
      price: product.price
    }));

    

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
      </div>
      <hr />
      {products.filter(product => cartItems[product._id] > 0).map((product) => (
        <div key={product._id}>
          <div className="cartitems-format">
            <Link to={`/products/${product._id}`}>
              <img src={product.images && product.images.product && product.images.product[0] ? product.images.product[0].url : ''} alt="" className="carticon-product-icon"/>
            </Link>
            <p>{product.name}</p>
            <p>${product.price}</p>
            <div className="cartitem-quantity-control">
              <FontAwesomeIcon 
                icon={faMinus} 
                onClick={() => removeFromCart(product._id)}
                className="quantity-icon"
              />
              <input 
                type="number"
                className="cartitem-quantity"
                value={cartItems[product._id]}
                onChange={(event) => updateCartItemCount(Number(event.target.value), product._id)}
              />
              <FontAwesomeIcon 
                icon={faPlus} 
                onClick={() => addToCart(product._id)}
                className="quantity-icon"
              />
            </div>
            <p>${product.price * cartItems[product._id]}</p>
          </div>
          <hr />
        </div>
      ))}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>$5</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${getTotalCartAmount()}</h3>
            </div>
          </div>
          <button onClick={openModal}>PROCEED TO CHECKOUT</button>
        </div>
      </div>
      
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <Order 
              orderItems={orderItems} 
              totalPrice={getTotalCartAmount()}
              closeModal={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItems;

