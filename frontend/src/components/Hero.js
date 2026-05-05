import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function Hero() {
  return (
    <section className="bg-zinc-950 border-b border-zinc-900">
      <div className="w-full px-4 md:px-8 lg:px-12 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-6 leading-tight">
            Цифрова техніка <br/>
            <span className="text-teal-400">для роботи та життя</span>
          </h1>
          <p className="text-zinc-400 text-base md:text-lg mb-8 max-w-xl leading-relaxed">
            Смартфони, ноутбуки, планшети та аудіотехніка від перевірених виробників. 
            Доставка по всій Україні.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              to="/catalog" 
              className="inline-flex items-center justify-center gap-2 bg-teal-400 hover:bg-teal-300 text-zinc-950 px-6 py-3 rounded font-medium transition"
            >
              Перейти до каталогу
              <ArrowRight size={18} strokeWidth={2} />
            </Link>
            <Link 
              to="/catalog?sort=price_asc" 
              className="inline-flex items-center justify-center gap-2 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white px-6 py-3 rounded font-medium transition"
            >
              Дивитись доступні
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;