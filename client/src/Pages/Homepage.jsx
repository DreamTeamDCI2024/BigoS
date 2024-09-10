import { Link } from "react-router-dom";
import '../Pages/CSS/HomePage.css';

const Homepage = () => {
    return (
        <div className="main">
            <div className="main-container">
            <p>Some motivational text bla bla bla</p>
            <h3>Press the button</h3>
            <Link to="/shop/all-products" className="shop-link">Go to Shop</Link>
                
            </div>
            
        </div>
    )
}

export default Homepage;