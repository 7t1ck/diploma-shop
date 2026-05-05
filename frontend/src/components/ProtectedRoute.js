import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, roles = [] }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl text-white mb-4">Доступ заборонено</h2>
        <p className="text-zinc-500">У вас немає прав для перегляду цієї сторінки.</p>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;