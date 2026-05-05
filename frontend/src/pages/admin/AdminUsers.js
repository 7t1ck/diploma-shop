import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api/api';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, role, is_active) => {
    try {
      await adminAPI.updateUser(id, { role, is_active });
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Помилка');
    }
  };

  if (loading) return <div className="text-zinc-500">Завантаження...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium text-white">Користувачі ({users.length})</h2>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-950/50 text-zinc-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Ім'я</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Телефон</th>
                <th className="text-left px-4 py-3">Роль</th>
                <th className="text-left px-4 py-3">Статус</th>
                <th className="text-left px-4 py-3">Дата</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t border-zinc-800 hover:bg-zinc-800/30">
                  <td className="px-4 py-3 text-white">{u.first_name} {u.last_name}</td>
                  <td className="px-4 py-3 text-zinc-400">{u.email}</td>
                  <td className="px-4 py-3 text-zinc-400">{u.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <select 
                      value={u.role} 
                      onChange={e => handleUpdate(u.id, e.target.value, u.is_active)}
                      className="bg-zinc-950 border border-zinc-800 text-white rounded px-2 py-1 text-xs focus:outline-none focus:border-teal-400"
                    >
                      <option value="customer">customer</option>
                      <option value="manager">manager</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => handleUpdate(u.id, u.role, !u.is_active)}
                      className={`text-xs px-2 py-1 rounded border ${
                        u.is_active 
                          ? 'text-teal-400 border-teal-400/30 bg-teal-400/10' 
                          : 'text-red-400 border-red-400/30 bg-red-400/10'
                      }`}
                    >
                      {u.is_active ? 'Активний' : 'Заблокований'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">
                    {new Date(u.created_at).toLocaleDateString('uk-UA')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;