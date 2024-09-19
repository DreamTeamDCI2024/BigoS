import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import './Breadcrumb.css';
//import arrow_icon from '../../Assets/Breadcrumb_separator_2.svg';

const Breadcrumb = (props) => {
    const {product} = props;
  return (
    <div className='breadcrumb'>
        <Link to='/'>HOME</Link> 
        <span className="breadcrumb-separator">{'>'}</span>
        <Link to='/shop/all-products'>Our Products</Link>
        <span className="breadcrumb-separator">{'>'}</span>
        {product.room}
        <span className="breadcrumb-separator">{'>'}</span>
        {product.name};
    </div>
  )
}
Breadcrumb.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    categories: PropTypes.string,
  }).isRequired,
};
export default Breadcrumb;

/*
{product.categories && product.categories.length > 0 && (
        <>
          {product.categories.map((category, index) => (
            <span key={index}>
              <Link to={`/shop/category/${category}`}>{category}</Link>
              {index < product.categories.length - 1 && <span className="breadcrumb-separator">{'>'}</span>}
            </span>
          ))}
            */