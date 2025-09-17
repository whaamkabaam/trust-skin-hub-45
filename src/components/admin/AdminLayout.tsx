import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="flex-shrink-0 h-full">
        <AdminSidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-none">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}