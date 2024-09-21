import { useEffect, useState } from "react";
import axiosInstance from "../../Context/axiosInstanse.jsx";
import '../../Pages/CSS/Profile.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found');
        }

        const response = await axiosInstance.get("/api/orders/myorders", {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token in the Authorization header
          },
        });
        if (response.data) {
          setOrders(response.data);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
   fetchOrders();
  }, []);
  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error loading orders: {error.message}. Please try again later.</div>;
  }

  if (orders.length === 0) {
    return <div>You have no orders.</div>;
  }

  return (
    <div className="order-wrap">
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <h4 className="order-id">Order ID: {order._id}</h4>
          <div className="order-details">
            <div>
              <h3>Shipping Address:</h3>
              <p>{order.shippingAddress.street}, {order.shippingAddress.houseNumber}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
            <div>
              <h3>Order Details:</h3>
              <p>Payment Method: {order.paymentMethod}</p>
              <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
            </div>
          </div>
          <h3>Order Items:</h3>
          <table>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.product.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Orders;