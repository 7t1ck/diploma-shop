import React from 'react';

function ProductCard({ product }) {
  const inStock = product.stock_quantity > 0;
  const hasDiscount = product.old_price && parseFloat(product.old_price) > parseFloat(product.price);
  const discountPercent = hasDiscount 
    ? Math.round((1 - product.price / product.old_price) * 100)
    : 0;

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 group">
      <div className="relative h-56 overflow-hidden bg-gray-800">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            -{discountPercent}%
          </div>
        )}
        
        {!inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500/90 text-white text-sm px-4 py-2 rounded-full">
              Немає в наявності
            </span>
          </div>
        )}
        
        <div className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur text-gray-300 text-xs px-3 py-1 rounded-full">
          {product.category_name}
        </div>
      </div>

      <div className="p-5">
        <div className="text-xs text-gray-500 mb-1">{product.brand_name}</div>
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            {hasDiscount && (
              <div className="text-gray-500 line-through text-sm">
                {parseFloat(product.old_price).toLocaleString()} ₴
              </div>
            )}
            <span className="text-2xl font-bold text-white">
              {parseFloat(product.price).toLocaleString()} ₴
            </span>
          </div>
          <button 
            disabled={!inStock}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition"
          >
            У кошик
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;