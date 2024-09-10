import { LivingRoom } from '../Components/LivingRoom/LivingRoom';
import Kitchen from '../Components/Kitchen/Kitchen';
import Bedroom from '../Components/Bedroom/Bedroom';
import AllProducts from '../Components/AllProducts/AllProducts';


export const Shop = () => {
  return (
    <div className="shop">
            <AllProducts/>
            <LivingRoom />
            <Kitchen/>
            <Bedroom/>
        </div>
  )
}