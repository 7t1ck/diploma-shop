import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productsAPI, catalogAPI } from '../api/api';

function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '',
  });

  useEffect(() => {
    loadCatalog();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadCatalog = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        catalogAPI.getCategories(),
        catalogAPI.getBrands()
      ]);
      setCategories(catRes.data.data);
      setBrands(brandRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const res = await productsAPI.getAll(params);
      setProducts(res.data.data);
      setSearchParams(params);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ category: '', brand: '', search: '', minPrice: '', maxPrice: '', sort: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-white mb-8">Каталог товарів</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Сайдбар з фільтрами */}
        <aside className="lg:col-span-1 bg-gray-900 rounded-2xl p-6 border border-gray-800 h-fit sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Фільтри</h3>
            <button onClick={resetFilters} className="text-blue-400 hover:text-blue-300 text-sm">
              Скинути
            </button>
          </div>

          {/* Пошук */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">Пошук</label>
            <input
              type="text"
              value={filters.search}
              onChange={e => updateFilter('search', e.target.value)}
              placeholder="Назва товару..."
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Категорії */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">Категорія</label>
            <select
              value={filters.category}
              onChange={e => updateFilter('category', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Всі категорії</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Бренди */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">Бренд</label>
            <select
              value={filters.brand}
              onChange={e => updateFilter('brand', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Всі бренди</option>
              {brands.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Ціна */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">Ціна, ₴</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.minPrice}
                onChange={e => updateFilter('minPrice', e.target.value)}
                placeholder="Від"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                value={filters.maxPrice}
                onChange={e => updateFilter('maxPrice', e.target.value)}
                placeholder="До"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Сортування */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Сортування</label>
            <select
              value={filters.sort}
              onChange={e => updateFilter('sort', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">За замовчуванням</option>
              <option value="price_asc">Ціна: за зростанням</option>
              <option value="price_desc">Ціна: за спаданням</option>
              <option value="name">За назвою</option>
            </select>
          </div>
        </aside>

        {/* Список товарів */}
        <main className="lg:col-span-3">
          <div className="mb-4 text-gray-400">
            {loading ? 'Завантаження...' : `Знайдено: ${products.length} товарів`}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <div key={i} className="bg-gray-900 rounded-2xl h-96 animate-pulse"></div>)}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-gray-900 rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-2xl text-white mb-2">Нічого не знайдено</h3>
              <p className="text-gray-400">Спробуй змінити фільтри</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default CatalogPage;