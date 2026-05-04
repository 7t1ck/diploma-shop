import React from 'react';

function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <h1 className="text-2xl font-bold text-white">TechShop</h1>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-gray-300 hover:text-blue-400 transition">Головна</a>
          <a href="#" className="text-gray-300 hover:text-blue-400 transition">Каталог</a>
          <a href="#" className="text-gray-300 hover:text-blue-400 transition">Про нас</a>
          <a href="#" className="text-gray-300 hover:text-blue-400 transition">Контакти</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-gray-300 hover:text-white transition">
            🔍
          </button>
          <button className="relative text-gray-300 hover:text-white transition">
            🛒
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
            Увійти
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;