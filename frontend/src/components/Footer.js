import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 mt-16">
      <div className="w-full px-4 md:px-8 lg:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Про магазин */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-teal-400 rounded flex items-center justify-center">
                <span className="text-zinc-950 font-bold">🌯</span>
              </div>
              <span className="text-lg font-semibold text-white">Телефон от Ахмеда</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
              Магазин цифрової техніки. Офіційна гарантія, доставка по Україні.
            </p>
          </div>

          {/* Каталог */}
          <div>
            <h4 className="text-zinc-300 text-sm font-medium mb-3">Каталог</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalog?category=smartphones" className="text-zinc-500 hover:text-teal-400 transition">Смартфони</Link></li>
              <li><Link to="/catalog?category=laptops" className="text-zinc-500 hover:text-teal-400 transition">Ноутбуки</Link></li>
              <li><Link to="/catalog?category=tablets" className="text-zinc-500 hover:text-teal-400 transition">Планшети</Link></li>
              <li><Link to="/catalog?category=audio" className="text-zinc-500 hover:text-teal-400 transition">Аудіотехніка</Link></li>
            </ul>
          </div>

          {/* Контакти */}
          <div>
            <h4 className="text-zinc-300 text-sm font-medium mb-3">Контакти</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>+380 (50) 123-45-67</li>
              <li>support@cifra.ua</li>
              <li>м. Київ, вул. Хрещатик, 1</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-900 mt-8 pt-5 text-xs text-zinc-600">
          
        </div>
      </div>
    </footer>
  );
}

export default Footer;