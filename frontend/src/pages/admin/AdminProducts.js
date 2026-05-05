import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import { productsAPI, catalogAPI } from '../../api/api';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [p, c, b] = await Promise.all([
        productsAPI.getAll(),
        catalogAPI.getCategories(),
        catalogAPI.getBrands(),
      ]);
      setProducts(p.data.data);
      setCategories(c.data.data);
      setBrands(b.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: '', description: '', price: '', old_price: '', stock_quantity: 0,
      image_url: '', category_id: '', brand_id: '', is_featured: false
    });
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({ ...product, is_active: product.is_active === 1 });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await productsAPI.update(editing.id, form);
      } else {
        await productsAPI.create(form);
      }
      setModalOpen(false);
      loadAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Помилка');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Видалити товар?')) return;
    try {
      await productsAPI.delete(id);
      loadAll();
    } catch (err) {
      alert('Помилка видалення');
    }
  };

  if (loading) return <div className="text-zinc-500">Завантаження...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-white">Керування товарами ({products.length})</h2>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-teal-400 hover:bg-teal-300 text-zinc-950 px-4 py-2 rounded text-sm font-medium transition">
          <Plus size={16} strokeWidth={2} /> Додати товар
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-950/50 text-zinc-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Фото</th>
                <th className="text-left px-4 py-3">Назва</th>
                <th className="text-left px-4 py-3">Категорія</th>
                <th className="text-right px-4 py-3">Ціна</th>
                <th className="text-right px-4 py-3">Склад</th>
                <th className="text-right px-4 py-3">Дії</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-t border-zinc-800 hover:bg-zinc-800/30">
                  <td className="px-4 py-3">
                    <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded" />
                  </td>
                  <td className="px-4 py-3 text-white">{p.name}</td>
                  <td className="px-4 py-3 text-zinc-400">{p.category_name}</td>
                  <td className="px-4 py-3 text-right text-white">{parseFloat(p.price).toLocaleString()} ₴</td>
                  <td className={`px-4 py-3 text-right ${p.stock_quantity < 5 ? 'text-red-400' : 'text-zinc-300'}`}>
                    {p.stock_quantity}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-zinc-400 hover:text-teal-400 transition" title="Редагувати">
                        <Pencil size={16} strokeWidth={1.5} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-zinc-400 hover:text-red-400 transition" title="Видалити">
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модалка */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">{editing ? 'Редагувати товар' : 'Новий товар'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Назва" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} required className="w-full bg-zinc-950 border border-zinc-800 text-white rounded px-4 py-2 focus:outline-none focus:border-teal-400" />
              <textarea placeholder="Опис" value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} rows="3" className="w-full bg-zinc-950 border border-zinc-800 text-white rounded px-4 py-2 focus:outline-none focus:border-teal-400 resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" step="0.01" placeholder="Ціна" value={form.price || ''} onChange={e => setForm({...form, price: e.target.value})} required className="bg-zinc-950 border border-zinc-800 text-white rounded px-4 py-2 focus:outline-none focus:border-teal-400" />
                <input type="number" step="0.01" placeholder="Стара ціна (необов'язково)" value={form.old_price || ''} onChange={e => setForm({...form, old_price: e.target.value})} className="bg-zinc-950 border border-zinc-800 text-white rounded px-4 py-2 focus:outline-none focus:border-teal-400" />
              </div>
              <input type="number" placeholder="Кількість на складі" value={form.stock_quantity || 0} onChange={e => setForm({...form, stock_quantity: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded px-4 py-2 focus:outline-none focus:border-teal-400" />
              <input type="text" placeholder="URL зображення" value={form.image_url || ''} onChange={e => setForm({...form, image_url: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded px-4 py-2 focus:outline-none focus:border-teal-400" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.category_id || ''} onChange={e => setForm({...form, category_id: e.target.value})} required className="bg-zinc-950 border border-zinc-800 text-white rounded px-4 py-2 focus:outline-none focus:border-teal-400">
                  <option value="">Категорія</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={form.brand_id || ''} onChange={e => setForm({...form, brand_id: e.target.value})} required className="bg-zinc-950 border border-zinc-800 text-white rounded px-4 py-2 focus:outline-none focus:border-teal-400">
                  <option value="">Бренд</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 text-zinc-400 text-sm">
                <input type="checkbox" checked={form.is_featured || false} onChange={e => setForm({...form, is_featured: e.target.checked})} />
                Рекомендований товар
              </label>
              <div className="flex gap-3 pt-3">
                <button type="submit" className="flex-1 bg-teal-400 hover:bg-teal-300 text-zinc-950 py-2 rounded font-medium transition">
                  {editing ? 'Зберегти' : 'Створити'}
                </button>
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 border border-zinc-800 hover:border-zinc-700 text-zinc-400 rounded transition">
                  Скасувати
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;