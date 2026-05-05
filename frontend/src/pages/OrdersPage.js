import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../api/api';

const statusLabels = {
  new: { label: 'Нове', color: 'text-blue-400 border-blue-400/30 bg-blue-400/10' },
  confirmed: { label: 'Підтверджено', color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' },
  shipped: { label: 'Відправлено', color: 'text-purple-400 border-purple-400/30 bg-purple-400/10' },
  delivered: { label: 'Доставлено', color: 'text-teal-400 border-teal-400/30 bg-teal-400/10' },
  cancelled: { label: 'Скасовано', color: 'text-red-400 border-red-400/30 bg-red-400/10' },
};

function OrdersPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const successOrderId = searchParams.get('success');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await ordersAPI.getMyOrders();
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl text-white mb-4">Потрібен вхід</h2>
        <Link to="/login" className="text-teal-400 hover:text-teal-300">Увійти</Link>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-10">
      <h1 className="text-2xl md:text-3xl font-semibold text-white mb-8">Мої замовлення</h1>

      {successOrderId && (
        <div className="bg-teal-400/10 border border-teal-400/30 text-teal-400 px-4 py-3 rounded mb-6">
          Замовлення №{successOrderId} успішно оформлено! Ми зв'яжемось з вами найближчим часом.
        </div>
      )}

      {loading ? (
        <div className="text-zinc-500">Завантаження...</div>
      ) : orders.length === 0 ? (
        <div className="bg-zinc-900 rounded-lg p-12 text-center border border-zinc-800">
          <h3 className="text-xl text-white mb-2">Замовлень поки немає</h3>
          <p className="text-zinc-500 mb-6">Перейдіть в каталог щоб обрати товари</p>
          <Link to="/catalog" className="inline-block bg-teal-400 hover:bg-teal-300 text-zinc-950 px-6 py-2.5 rounded transition">
            До каталогу
          </Link>
        </div>
      ) : (
        <div className="space-y-4 max-w-5xl">
          {orders.map(order => {
            const status = statusLabels[order.status] || statusLabels.new;
            return (
              <div key={order.id} className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="text-white font-medium">Замовлення №{order.id}</div>
                    <div className="text-zinc-500 text-xs">
                      {new Date(order.created_at).toLocaleString('uk-UA')}
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full border ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <div className="px-6 py-4 space-y-3">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 text-sm">
                      <img src={item.image_url} alt={item.product_name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-grow">
                        <div className="text-white">{item.product_name}</div>
                        <div className="text-zinc-500">{item.quantity} × {parseFloat(item.price).toLocaleString()} ₴</div>
                      </div>
                      <div className="text-zinc-300">
                        {(parseFloat(item.price) * item.quantity).toLocaleString()} ₴
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/50 flex justify-between items-center flex-wrap gap-2">
                  <div className="text-zinc-500 text-xs">
                    Доставка: {order.delivery_city}, {order.delivery_address}
                  </div>
                  <div className="text-white font-semibold">
                    {parseFloat(order.total_price).toLocaleString()} ₴
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;