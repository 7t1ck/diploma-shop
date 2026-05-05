import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ 
    first_name: '', 
    last_name: '', 
    email: '', 
    password: '', 
    phone: '' 
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (form.password.length < 6) {
      setError('Пароль має містити мінімум 6 символів');
      return;
    }

    const result = await register(form);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
        <h1 className="text-2xl font-semibold text-white mb-2">Реєстрація</h1>
        <p className="text-zinc-500 text-sm mb-6">Створіть новий акаунт</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 text-sm mb-2">Ім'я</label>
              <input
                type="text"
                value={form.first_name}
                onChange={e => updateField('first_name', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded px-4 py-2.5 focus:outline-none focus:border-teal-400 transition"
                required
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm mb-2">Прізвище</label>
              <input
                type="text"
                value={form.last_name}
                onChange={e => updateField('last_name', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded px-4 py-2.5 focus:outline-none focus:border-teal-400 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 text-sm mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => updateField('email', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded px-4 py-2.5 focus:outline-none focus:border-teal-400 transition"
              placeholder="user@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-sm mb-2">Телефон</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => updateField('phone', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded px-4 py-2.5 focus:outline-none focus:border-teal-400 transition"
              placeholder="+380 50 123 45 67"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-sm mb-2">Пароль</label>
            <input
              type="password"
              value={form.password}
              onChange={e => updateField('password', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded px-4 py-2.5 focus:outline-none focus:border-teal-400 transition"
              placeholder="Мінімум 6 символів"
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
            {loading ? 'Створення...' : 'Зареєструватися'}
          </button>
        </form>

        <p className="text-zinc-500 text-sm text-center mt-6">
          Вже маєш акаунт? <Link to="/login" className="text-teal-400 hover:text-teal-300">Увійти</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;