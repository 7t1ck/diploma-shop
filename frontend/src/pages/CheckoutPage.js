import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../api/api';

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  
  const [form, setForm] = useState({
    delivery_city: '',
    delivery_address: '',
    phone: user?.phone || '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Якщо не залогінений — редирект на login
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Якщо кошик порожній — редирект на каталог
  React.useEffect(() => {
    if (cart.length === 0) {
      navigate('/catalog');
    }
  }, [cart, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const items = cart.map(item => ({
        id: item.id,
        quantity: item.quantity
      }));

      const res = await ordersAPI.create({
        items,
        ...form
      });

      clearCart();
      navigate(`/orders?success=${res.data.orderId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Помилка оформлення замовлення');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 || !user) return null;

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-10">
      <h1 className="text-2xl md:text-3xl font-semibold text-white mb-8">Оформлення замовлення</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
        {/* Форма */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h3 className="text-lg font-medium text-white mb-4">Дані доставки</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Ім'я</label>
                <input
                  type="text"
                  value={user.first_name}
                  disabled
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-500 rounded px-4 py-2.5"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Прізвище</label>
                <input
                  type="text"
                  value={user.last_name}
                  disabled
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-500 rounded px-4 py-2.5"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Місто *</label>
                <input
                  type="text"
                  value={form.delivery_city}
                  onChange={e => setForm({...form, delivery_city: e.target.value})}
                  placeholder="Київ"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded px-4 py-2.5 focus:outline-none focus:border-teal-400 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Телефон *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  placeholder="+380 50 123 45 67"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded px-4 py-2.5 focus:outline-none focus:border-teal-400 transition"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-zinc-400 text-sm mb-2">Адреса доставки *</label>
                <input
                  type="text"
                  value={form.delivery_address}
                  onChange={e => setForm({...form, delivery_address: e.target.value})}
                  placeholder="вул. Хрещатик, 1, кв. 5"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded px-4 py-2.5 focus:outline-none focus:border-teal-400 transition"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-zinc-400 text-sm mb-2">Коментар до замовлення</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})}
                  rows="3"
                  placeholder="Додаткові побажання..."
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded px-4 py-2.5 focus:outline-none focus:border-teal-400 transition resize-none"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}
        </form>

        {/* Підсумок */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 h-fit">
          <h3 className="text-lg font-medium text-white mb-4">Ваше замовлення</h3>
          
          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <img src={item.image_url} alt={item.name} className="w-12 h-12 object-cover rounded" />
                <div className="flex-grow">
                  <div className="text-white line-clamp-1">{item.name}</div>
                  <div className="text-zinc-500">{item.quantity} × {parseFloat(item.price).toLocaleString()} ₴</div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-zinc-800 mb-6 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Товарів:</span>
              <span>{cart.length}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Доставка:</span>
              <span className="text-teal-400">Безкоштовно</span>
            </div>
            <div className="flex justify-between text-white text-base font-semibold pt-2 border-t border-zinc-800">
              <span>Разом:</span>
              <span>{totalPrice.toLocaleString()} ₴</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-teal-400 hover:bg-teal-300 disabled:bg-zinc-700 text-zinc-950 disabled:text-zinc-500 py-3 rounded font-medium transition"
          >
            {loading ? 'Оформлення...' : 'Підтвердити замовлення'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;