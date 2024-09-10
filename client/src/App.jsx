import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import Header from './Components/Header/Header.jsx';
import About from './Pages/About.jsx';
import Contact from './Pages/Contact.jsx';
import Login from './Pages/Login.jsx';
import Cart from './Pages/Cart.jsx';
import Homepage from './Pages/Homepage.jsx';
import Wishlist from './Pages/Wishlist.jsx';
import LivingRoom from './Components/LivingRoom/LivingRoom.jsx';
import Kitchen from './Components/Kitchen/Kitchen.jsx';
import Bedroom from './Components/Bedroom/Bedroom.jsx';
import { UserContextProvider } from './Context/UserContext.jsx';
import Profile from './Pages/Profile.jsx';
import Logout from './Components/Profile/Logout.jsx';
import Settings from './Components/Profile/Settings.jsx';
import Orders from './Components/Profile/Orders.jsx';
import AllProducts from './Components/AllProducts/AllProducts.jsx';
import ShopContextProvider from './Context/ShopContext.jsx';
import ProductDisplay from './Components/ProductDisplay/ProductDisplay.jsx';


function App() {
  return (
    <div>
      <UserContextProvider>
      <ShopContextProvider>
      <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/about' element={<About/>}/>
          <Route path='/shop/all-products' element={<AllProducts/>}/>
          <Route path='/shop/living-room' element={<LivingRoom/>}/>
          <Route path='/shop/kitchen' element={<Kitchen/>}/>
          <Route path='/shop/bedroom' element={<Bedroom/>}/>
        <Route path='/products/:id' element={<ProductDisplay/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/wishlist' element={<Wishlist/>}/>
        <Route path='/profile' element={<Profile/>}>
          <Route path='/profile/orders' element={<Orders/>}/>
          <Route path='/profile/settings' element={<Settings/>}/>
          <Route path='/profile/logout' element={<Logout/>}/>
        </Route>
        
        
          
      </Routes>
      </BrowserRouter>
      </ShopContextProvider>
      </UserContextProvider>
    </div>
  );
}

export default App;
