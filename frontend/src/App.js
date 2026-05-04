import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import { productsAPI } from './api/api';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Помилка завантаження товарів:', err);
      setError('Не вдалось завантажити товари. Перевір що бекенд працює.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <Hero />
      
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Популярні товари</h2>
            <p className="text-gray-400">
              {loading ? 'Завантаження...' : `Знайдено ${products.length} товарів`}
            </p>
          </div>
          <button className="text-blue-400 hover:text-blue-300 transition hidden md:block">
            Дивитись всі →
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg mb-6">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-gray-900 rounded-2xl h-96 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          <p>© 2025 TechShop. Дипломний проект.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;