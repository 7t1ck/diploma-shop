import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../../api/api';

const statusOptions = [
  { value: 'new', label: 'Нове' },
  { value: 'confirmed', label: 'Підтверджено' },
  { value: 'shipped', label: 'Відправлено' },
  { value: 'delivered', label: 'Доставлено' },
  { value: 'cancelled', label: 'Скасовано' },
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await ordersAPI.getAll();
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      loadOrders();
    } catch (err) {
      alert('Помилка зміни статусу');
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) return <div className="text-zinc-500">Завантаження...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-medium text-white">Замовлення ({filteredOrders.length})</h2>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-zinc-900 border border-zinc-800 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-teal-400">
          <option value="all">Всі</option>
          {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="text-white font-medium">№{order.id} — {order.first_name} {order.last_name}</div>
                <div className="text-zinc-500 text-xs">
                  {new Date(order.created_at).toLocaleString('uk-UA')} • {order.email}
                </div>
              </div>
              <select 
                value={order.status} 
                onChange={e => handleStatusChange(order.id, e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-white rounded px-3 py-1.5 text-sm focus:outline-none focus:border-teal-400"
              >
                {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div className="px-5 py-3 space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  <img src={item.image_url} alt={item.product_name} className="w-10 h-10 object-cover rounded" />
                  <div className="flex-grow text-zinc-300">{item.product_name}</div>
                  <div className="text-zinc-500">{item.quantity} × {parseFloat(item.price).toLocaleString()} ₴</div>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950/50 flex justify-between items-center text-sm flex-wrap gap-2">
              <div className="text-zinc-500">
                {order.delivery_city}, {order.delivery_address} • {order.phone}
              </div>
              <div className="text-white font-semibold">{parseFloat(order.total_price).toLocaleString()} ₴</div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center text-zinc-500">
            Немає замовлень з цим статусом
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;