import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

const handleLogout = () => {
  logout();
  navigate('/');
};

  const navLinks = [
    { to: '/', label: 'Головна' },
    { to: '/catalog', label: 'Каталог' },
    { to: '/catalog?category=smartphones', label: 'Смартфони' },
    { to: '/catalog?category=laptops', label: 'Ноутбуки' },
    { to: '/catalog?category=audio', label: 'Аудіо' },
  ];

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname + location.search === to || location.pathname.startsWith(to.split('?')[0]) && to !== '/';
  };

  return (
    <header className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Лого */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-11 h-11 bg-teal-600 rounded flex items-center justify-center">
              <span className="text-zinc-950 font-bold text-lg">К</span>
            </div>
            <span className="text-xl font-semibold text-white tracking-tight">Кантама</span>
          </Link>

          {/* Навігація - десктоп */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center max-w-2xl mx-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 text-sm rounded transition ${
                  isActive(link.to) 
                    ? 'text-teal-400 bg-zinc-900' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Дії справа */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <Link to="/cart" className="relative p-2 text-zinc-400 hover:text-white transition">
              <ShoppingCart size={20} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-teal-400 text-zinc-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                {(user.role === 'admin' || user.role === 'manager') && (
                    <Link to="/admin" className="hidden md:block text-xs font-medium text-teal-400 border border-teal-400/40 hover:bg-teal-400 hover:text-zinc-950 px-3 py-1.5 rounded transition">
                        {user.role === 'admin' ? 'Адмін-панель' : 'Панель менеджера'}
                    </Link>
                )}
                    <Link to="/orders" className="hidden md:flex items-center gap-2 text-sm text-zinc-300 hover:text-teal-400 transition">
                        <User size={16} strokeWidth={1.5} />
                         {user.first_name}
                    </Link>
                <button onClick={handleLogout} className="text-sm text-zinc-500 hover:text-red-400 transition">
                  Вийти
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded transition">
                <User size={16} strokeWidth={1.5} />
                Увійти
              </Link>
            )}

            {/* Бургер - мобільний */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 text-zinc-400 hover:text-white">
              {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Мобільне меню */}
        {menuOpen && (
          <div className="lg:hidden border-t border-zinc-800 py-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 text-sm text-zinc-300 hover:text-teal-400 hover:bg-zinc-900 rounded transition"
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 text-sm text-zinc-300 hover:text-teal-400 hover:bg-zinc-900 rounded transition mt-2 border-t border-zinc-800 pt-4"
                >
                  Увійти
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;