import { LivingRoom } from '../Components/Livingroom/LivingRoom';
import Balcony from '../Components/Balcony/Balcony';
import Bedroom from '../Components/Bedroom/BedRoom';
import BathRoom from '../Components/Bathroom/BathRoom';
import AllProducts from '../Components/AllProducts/AllProducts';


export const Shop = () => {
  return (
    <div className="shop">
            <AllProducts/>
            <LivingRoom />
            <Balcony/>
            <Bedroom/>
            <BathRoom/>
        </div>
  )
}