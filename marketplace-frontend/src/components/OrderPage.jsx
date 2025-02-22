import { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState('');

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders', { params: { email } });
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div className="order-page">
      <h1>Your Orders</h1>
      <div className="order-filter">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={fetchOrders}>Load Orders</button>
      </div>
      
      {orders.length > 0 ? (
        <div className="order-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <h3>Order #{order.id}</h3>
              <p>Status: {order.status}</p>
              <p>Quantity: {order.quantity}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found for this email</p>
      )}
    </div>
  );
};

export default OrderPage