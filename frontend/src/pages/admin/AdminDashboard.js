import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ShoppingBag, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { adminAPI } from '../../api/api';

function StatCard({ icon: Icon, label, value, color = 'teal' }) {
  const colors = {
    teal: 'text-teal-400 border-teal-400/20 bg-teal-400/5',
    blue: 'text-blue-400 border-blue-400/20 bg-blue-400/5',
    yellow: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5',
    red: 'text-red-400 border-red-400/20 bg-red-400/5',
  };
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
      <div className={`inline-flex p-2 rounded border ${colors[color]} mb-3`}>
        <Icon size={18} strokeWidth={1.5} />
      </div>
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="text-zinc-500 text-sm mt-1">{label}</div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await adminAPI.getStats();
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-zinc-500">Завантаження...</div>;
  if (!stats) return <div className="text-red-400">Помилка завантаження</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon={Package} label="Активних товарів" value={stats.products} />
        <StatCard icon={Users} label="Покупців" value={stats.users} color="blue" />
        <StatCard icon={ShoppingBag} label="Всього замовлень" value={stats.orders} />
        <StatCard icon={TrendingUp} label="Виручка, ₴" value={parseFloat(stats.revenue).toLocaleString()} />
        <StatCard icon={Clock} label="Нових замовлень" value={stats.newOrders} color="yellow" />
        <StatCard icon={AlertCircle} label="Мало на складі" value={stats.lowStock} color="red" />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-white font-medium">Останні замовлення</h3>
          <Link to="/admin/orders" className="text-teal-400 text-sm hover:text-teal-300">Всі →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-950/50 text-zinc-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">№</th>
                <th className="text-left px-5 py-3">Клієнт</th>
                <th className="text-left px-5 py-3">Дата</th>
                <th className="text-left px-5 py-3">Статус</th>
                <th className="text-right px-5 py-3">Сума</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map(order => (
                <tr key={order.id} className="border-t border-zinc-800 hover:bg-zinc-800/30">
                  <td className="px-5 py-3 text-white">#{order.id}</td>
                  <td className="px-5 py-3 text-zinc-300">{order.first_name} {order.last_name}</td>
                  <td className="px-5 py-3 text-zinc-500">{new Date(order.created_at).toLocaleDateString('uk-UA')}</td>
                  <td className="px-5 py-3 text-zinc-400">{order.status}</td>
                  <td className="px-5 py-3 text-right text-white">{parseFloat(order.total_price).toLocaleString()} ₴</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;