import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

function AdminLayout() {
  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-white mb-6">Адмін-панель</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <AdminSidebar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;