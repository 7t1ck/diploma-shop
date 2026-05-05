import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(form.email, form.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
        <h1 className="text-2xl font-semibold text-white mb-2">Вхід</h1>
        <p className="text-zinc-500 text-sm mb-6">Увійдіть до свого акаунту</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-zinc-400 text-sm mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded px-4 py-2.5 focus:outline-none focus:border-teal-400 transition"
              placeholder="user@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-zinc-400 text-sm mb-2">Пароль</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded px-4 py-2.5 focus:outline-none focus:border-teal-400 transition"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2.5 rounded text-sm">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-teal-400 hover:bg-teal-300 disabled:bg-zinc-700 text-zinc-950 disabled:text-zinc-500 py-2.5 rounded font-medium transition"
          >
            {loading ? 'Вхід...' : 'Увійти'}
          </button>
        </form>

        <p className="text-zinc-500 text-sm text-center mt-6">
          Немає акаунту? <Link to="/register" className="text-teal-400 hover:text-teal-300">Зареєструватися</Link>
        </p>

        <div className="mt-6 pt-6 border-t border-zinc-800">
          <p className="text-xs text-zinc-600 mb-2">Тестові акаунти:</p>
          <div className="text-xs text-zinc-500 space-y-1">
            <div>admin@techshop.com / admin123</div>
            <div>manager@techshop.com / manager123</div>
            <div>user@techshop.com / user123</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;