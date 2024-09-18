import { useEffect, useState } from "react";
import axiosInstance from "../../Context/axiosInstanse.jsx";


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
          <h2 style={{ fontSize: '14px', marginBottom: '10px' }}>Order ID: {order._id}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '14px', marginBottom: '10px' }}>Shipping Address:</h3>
              <p>{order.shippingAddress.street}, {order.shippingAddress.houseNumber}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
            <div>
              <h3 style={{ fontSize: '14px', marginBottom: '10px' }}>Order Details:</h3>
              <p>Payment Method: {order.paymentMethod}</p>
              <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
            </div>
          </div>
          <h3 style={{ fontSize: '14px', marginBottom: '10px' }}>Order Items:</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>Product</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>Quantity</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item) => (
                <tr key={item._id}>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{item.product.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{item.quantity}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>${item.price.toFixed(2)}</td>
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