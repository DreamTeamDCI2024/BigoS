import PropTypes from 'prop-types';
import {createContext, useState, useEffect} from "react";
import axiosInstance from "./axiosInstanse.jsx";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    
    const getDefaultCart = (productList) => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
          return JSON.parse(savedCart);
        }
    
        let cart = {};
        productList.forEach(product => {
          cart[product._id] = 0;
        });
        return cart;
    };
    
    const getDefaultWishlist = (productList) => {
        const savedWishlist = localStorage.getItem('wishlistItems');
        if (savedWishlist) {
          return JSON.parse(savedWishlist);
        }
    
        let wishlist = {};
        productList.forEach(product => {
          wishlist[product._id] = false;
        });
        return wishlist;
    };

    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState(()=> getDefaultCart([]));
    const [wishlistItems, setWishlistItems] = useState(() => getDefaultWishlist([]));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        axiosInstance.get('/api/products')
        .then(response => {
            setProducts(response.data);
            setCartItems(prevCart => {
                const defaultCart = getDefaultCart(response.data);
                return {...defaultCart, ...prevCart};
            });
            setWishlistItems(prevWishlist => {
                const defaultWishlist = getDefaultWishlist(response.data);
                return {...defaultWishlist, ...prevWishlist};
            });
            setLoading(false);
        })
        .catch(error => {
            console.error('Axios error:', error);
            setError('Error fetching products: ' + (error.response?.data?.message || error.message));
            setLoading(false);
        });
    }, [setError, setLoading]);


   
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);
    
    useEffect(() => {
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }, [wishlistItems]);
    

    const addToCart= (itemId)=> {
        setCartItems((prev) =>{
            const newCart = {...prev};
            newCart[itemId] = (newCart[itemId] || 0) +1;

            localStorage.setItem('cartItems', JSON.stringify(newCart));
            return newCart;
        });

        if(localStorage.getItem('token')){
            axiosInstance.post('/api/cart/addtocart', {itemId}, {
                headers:{
                    'Authorization':`Bearer ${localStorage.getItem('token')}`,
                    'Content-Type':'application/json',
                },
            })
            .then((response) => console.log(response.data))
            .catch((error) => console.error('Error adding to cart:', error));
    
        }
        console.log(cartItems);
    }

    const addToWishList = (itemId)=> {
        setWishlistItems((prev) =>{
            const newWishlist = {...prev, [itemId]: true};

            localStorage.setItem('wishlistItems', JSON.stringify(newWishlist));
            return newWishlist;
        });
    };
    const removeFromCart= (itemId)=> {
        setCartItems((prev) =>{
            const newCart = {...prev};
            if (newCart[itemId]> 0) {
                newCart[itemId] -= 1;
                if(newCart[itemId] <=0) {
                    delete newCart[itemId];
                }
            }
            localStorage.setItem('cartItems', JSON.stringify(newCart));
            return newCart;
        });    
    };
    const removeFromWishlist = (itemId) => {
        setWishlistItems((prev) => {
            const newWishlist = {...prev, [itemId]: false};

            localStorage.setItem('wishlistItems', JSON.stringify(newWishlist));
            return newWishlist;
        });
    }
    const toggleWishlist = (itemId) => {
        setWishlistItems((prev) => {
            console.log('Previous state:', prev);
            const newWishlist = { ...prev };
            newWishlist[itemId] = !newWishlist[itemId];
            console.log('Updated wishlist:', newWishlist);
            return newWishlist;
        });
    };

    const updateCartItemCount = (quantity, itemId) => {
        setCartItems((prev) => {
            const newCart = { ...prev };
            if (quantity > 0) {
                newCart[itemId] = quantity;
            } else {
                delete newCart[itemId];
            }

            localStorage.setItem('cartItems', JSON.stringify(newCart));
            return newCart;
        });
    };
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        if (!Array.isArray(products)) {
            console.error('Products is not an array:', products);
            return totalAmount;
        }
        for(const itemId in cartItems){
            if(cartItems[itemId]>0)
            {
                const itemInfo = products.find((product) => product._id === itemId);
                
                if (itemInfo) {
                totalAmount += itemInfo.price* cartItems[itemId];
                }
            }
        }
        return totalAmount;
    };


    const getTotalCartItems = () => {
        let totalItems= 0;
        for(const item in cartItems)
        {
            if(cartItems[item]>0){
                totalItems += cartItems[item];
            }
        }
        return totalItems;
    };

    const getTotalWishlistItems = () => {
        let totalItems = 0;
        for(const item in wishlistItems)
        {
            if(wishlistItems[item] ) {
                totalItems += 1;
            }
        }
        return totalItems;
    };

    const clearCart = () => {
        setCartItems({});
      };

    const contextValue = {clearCart, updateCartItemCount, toggleWishlist, getTotalCartItems, getTotalWishlistItems, getTotalCartAmount, cartItems, addToCart, removeFromCart, wishlistItems, addToWishList, removeFromWishlist};
    
    return (
        <ShopContext.Provider value={contextValue}>
            {loading ? (
            <div className="loading-spinner">Loading...</div> // Display a loading spinner or message
        ) : (
            props.children
        )}
        {error && <div className="error-message">{error}</div>} 
        </ShopContext.Provider>
    )
};
ShopContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ShopContextProvider;