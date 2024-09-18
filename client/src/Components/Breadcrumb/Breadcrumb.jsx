import PropTypes from 'prop-types';
import './Breadcrumb.css';
//import arrow_icon from '../../Assets/Breadcrumb_separator_2.svg';

const Breadcrumb = (props) => {
    const {product} = props;
  return (
    <div className='breadcrumb'>
        <div className="breadcrumb">
        HOME <img src='' alt="" /> SHOP <img src=''alt="" /> {product.categories} <img src='' alt="" /> {product.name};</div> 
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