import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleCheckout = () => {
  if (!user) {
    navigate('/login');
    return;
  }
  navigate('/checkout');
};

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-3xl font-bold text-white mb-4">Ваш кошик порожній</h2>
        <p className="text-gray-400 mb-8">Додайте товари з каталогу</p>
        <Link to="/catalog" className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition">
          До каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-white mb-8">Кошик</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-gray-900 rounded-2xl p-4 border border-gray-800 flex items-center gap-4">
              <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
              <div className="flex-grow">
                <Link to={`/product/${item.id}`} className="text-white font-semibold hover:text-blue-400">
                  {item.name}
                </Link>
                <div className="text-gray-400 text-sm">{item.brand_name}</div>
                <div className="text-blue-400 font-bold mt-1">
                  {parseFloat(item.price).toLocaleString()} ₴
                </div>
              </div>
              <div className="flex items-center bg-gray-800 rounded-lg">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 text-white hover:bg-gray-700 rounded-l-lg">−</button>
                <span className="w-10 text-center text-white">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 text-white hover:bg-gray-700 rounded-r-lg">+</button>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 text-2xl">
                ×
              </button>
            </div>
          ))}

          <button onClick={clearCart} className="text-gray-400 hover:text-red-400 transition text-sm">
            🗑 Очистити кошик
          </button>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 h-fit sticky top-24">
          <h3 className="text-xl font-bold text-white mb-6">Сума замовлення</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-400">
              <span>Товарів:</span>
              <span>{cart.length}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Доставка:</span>
              <span className="text-green-400">Безкоштовно</span>
            </div>
            <div className="border-t border-gray-800 pt-3 flex justify-between text-white text-xl font-bold">
              <span>Разом:</span>
              <span>{totalPrice.toLocaleString()} ₴</span>
            </div>
          </div>
          <button onClick={handleCheckout} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition">
            Оформити замовлення
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;