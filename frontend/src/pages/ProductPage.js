import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productsAPI } from '../api/api';
import { useCart } from '../context/CartContext';

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await productsAPI.getById(id);
      setProduct(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    navigate('/cart');
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-6 py-20 text-center text-gray-400">Завантаження...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl text-white mb-4">Товар не знайдено</h2>
        <Link to="/catalog" className="text-blue-400 hover:text-blue-300">← До каталогу</Link>
      </div>
    );
  }

  const inStock = product.stock_quantity > 0;
  const hasDiscount = product.old_price && parseFloat(product.old_price) > parseFloat(product.price);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-blue-400">Головна</Link>
        {' / '}
        <Link to="/catalog" className="hover:text-blue-400">Каталог</Link>
        {' / '}
        <span className="text-white">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Зображення */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
          <img src={product.image_url} alt={product.name} className="w-full h-[500px] object-cover" />
        </div>

        {/* Інформація */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-500/10 text-blue-400 text-sm px-3 py-1 rounded-full border border-blue-500/30">
              {product.category_name}
            </span>
            <span className="text-gray-400">{product.brand_name}</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
          <p className="text-gray-400 text-lg mb-6">{product.description}</p>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
            <div className="flex items-end gap-4 mb-6">
              <span className="text-4xl font-bold text-white">
                {parseFloat(product.price).toLocaleString()} ₴
              </span>
              {hasDiscount && (
                <span className="text-2xl text-gray-500 line-through">
                  {parseFloat(product.old_price).toLocaleString()} ₴
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-6">
              {inStock ? (
                <>
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-green-400">В наявності ({product.stock_quantity} шт)</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  <span className="text-red-400">Немає в наявності</span>
                </>
              )}
            </div>

            {inStock && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-400">Кількість:</span>
                <div className="flex items-center bg-gray-800 rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 text-white hover:bg-gray-700 rounded-l-lg">−</button>
                  <span className="w-12 text-center text-white">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} className="w-10 h-10 text-white hover:bg-gray-700 rounded-r-lg">+</button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 text-white py-4 rounded-lg font-medium text-lg transition"
            >
              {inStock ? '🛒 Додати в кошик' : 'Немає в наявності'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="text-2xl mb-1">🚚</div>
              <div className="text-xs text-gray-400">Швидка доставка</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="text-2xl mb-1">✅</div>
              <div className="text-xs text-gray-400">Гарантія якості</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="text-2xl mb-1">💳</div>
              <div className="text-xs text-gray-400">Безпечна оплата</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;