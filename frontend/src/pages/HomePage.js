import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Laptop, Tablet, Headphones, Watch, ArrowRight } from 'lucide-react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { productsAPI, catalogAPI } from '../api/api';

const categoryIcons = {
  smartphones: Smartphone,
  laptops: Laptop,
  tablets: Tablet,
  audio: Headphones,
  smartwatches: Watch,
};

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getFeatured(),
        catalogAPI.getCategories()
      ]);
      setProducts(productsRes.data.data);
      setCategories(categoriesRes.data.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Hero />
      
      {/* Категорії */}
      <section className="w-full px-4 md:px-8 lg:px-12 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Категорії товарів
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map(cat => {
            const Icon = categoryIcons[cat.slug] || Smartphone;
            return (
              <Link
                key={cat.id}
                to={`/catalog?category=${cat.slug}`}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-teal-400/50 rounded-lg p-5 transition group"
              >
                <Icon size={28} strokeWidth={1.5} className="text-zinc-400 group-hover:text-teal-400 transition mb-3" />
                <div className="text-white text-sm font-medium">{cat.name}</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Каталог товарів */}
      <section className="w-full px-4 md:px-8 lg:px-12 py-16 bg-zinc-950 border-t border-zinc-900">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-1">
              Каталог
            </h2>
            <p className="text-zinc-500 text-sm">Підбірка товарів зі складу</p>
          </div>
          <Link to="/catalog" className="hidden md:inline-flex items-center gap-1 text-sm text-teal-400 hover:text-teal-300 transition">
            Дивитись все
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[1,2,3,4,5].map(i => <div key={i} className="bg-zinc-900 rounded-lg aspect-[3/4] animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </section>
    </>
  );
}

export default HomePage;