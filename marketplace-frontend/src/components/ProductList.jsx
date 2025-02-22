import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Delete failed:', error.response?.data || error.message);
      alert(`Delete failed: ${error.response?.data?.error || error.message}`);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          {/* {product.imageUrl && (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              onError={(e) => {
                e.target.src = '/fallback-image.jpg';
                e.target.onerror = null;
              }}
            />
          )} */}
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>${product.price?.toFixed(2)}</p>
          <div className="product-actions">
            <Link to={`/edit/${product.id}`} className="btn edit">Edit</Link>
            <button 
              onClick={() => handleDelete(product.id)}
              className="btn delete"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;