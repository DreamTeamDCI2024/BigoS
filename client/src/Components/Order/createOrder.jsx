import axiosInstance from "../../Context/axiosInstanse.jsx";

const createOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post('/api/orders', orderData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.status === 201) {
      // Order created successfully
      console.log('Order created:', response.data.createdOrder);
      return response.data.createdOrder;
    } else {
      // Error creating order
      console.error('Error creating order:', response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Axios error:', error);
    throw error;
  }
};

export { createOrder };