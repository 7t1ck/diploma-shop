import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function AdminSidebar() {
  const { user } = useAuth();
  
  const links = [
    { to: '/admin', label: 'Дашборд', icon: LayoutDashboard, roles: ['admin', 'manager'] },
    { to: '/admin/products', label: 'Товари', icon: Package, roles: ['admin'] },
    { to: '/admin/orders', label: 'Замовлення', icon: ShoppingBag, roles: ['admin', 'manager'] },
    { to: '/admin/users', label: 'Користувачі', icon: Users, roles: ['admin'] },
  ];

  const allowedLinks = links.filter(l => l.roles.includes(user?.role));

  return (
    <aside className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 h-fit sticky top-20">
      <div className="text-xs uppercase tracking-wide text-zinc-600 px-3 py-2 mb-1">
        Панель керування
      </div>
      <nav className="flex flex-col gap-1">
        {allowedLinks.map(link => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded text-sm transition ${
                  isActive 
                    ? 'bg-teal-400/10 text-teal-400 border border-teal-400/20' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent'
                }`
              }
            >
              <Icon size={16} strokeWidth={1.5} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default AdminSidebar;