import React from 'react';

function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.15),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="max-w-2xl">
          <span className="inline-block bg-blue-500/10 text-blue-400 text-sm px-4 py-1 rounded-full mb-4 border border-blue-500/30">
            🔥 Новинки 2025
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Цифрові гаджети <br/>
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              нового покоління
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Знайди свій ідеальний гаджет серед сотень моделей від провідних світових брендів. 
            Швидка доставка, гарантія якості та кращі ціни.
          </p>
          <div className="flex gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition">
              Перейти в каталог
            </button>
            <button className="border border-gray-700 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-medium transition">
              Дізнатись більше
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;