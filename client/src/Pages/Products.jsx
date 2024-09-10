import {useContext} from "react";
import {ShopContext} from '../Context/ShopContext.jsx';
import {useParams} from 'react-router-dom';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay.jsx';
 
const Products = () => {
    const {all_products} = useContext(ShopContext);
    const {productId} = useParams();
    const product = all_products.find((e)=> e.id === Number(productId));
    return (
        <div className="products">
            
            
            <ProductDisplay product={product}/>
        </div>
    )
}

export default Products;