import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const inStock = product.stock_quantity > 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-700 transition h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-zinc-800">
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!inStock && (
            <div className="absolute inset-0 bg-zinc-950/70 flex items-center justify-center">
              <span className="text-zinc-300 text-sm border border-zinc-700 px-3 py-1 rounded">
                Немає в наявності
              </span>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wide">{product.brand_name}</div>
          <h3 className="text-white text-base mb-2 line-clamp-2 group-hover:text-teal-400 transition min-h-[3rem]">
            {product.name}
          </h3>
          
          <div className="flex items-end justify-between mt-auto pt-3">
            <div>
              {product.old_price && parseFloat(product.old_price) > parseFloat(product.price) && (
                <div className="text-zinc-600 line-through text-xs">
                  {parseFloat(product.old_price).toLocaleString()} ₴
                </div>
              )}
              <span className="text-lg font-semibold text-white">
                {parseFloat(product.price).toLocaleString()} ₴
              </span>
            </div>
            <button 
              onClick={handleAddToCart}
              disabled={!inStock}
              className="p-2 bg-zinc-800 hover:bg-teal-400 hover:text-zinc-950 disabled:bg-zinc-900 disabled:text-zinc-700 disabled:cursor-not-allowed text-zinc-300 rounded transition"
              title="Додати в кошик"
            >
              <ShoppingCart size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;