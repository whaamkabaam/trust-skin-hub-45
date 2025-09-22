import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export function AdminLayout() {
  return (
    <div className="admin-container flex bg-background overflow-hidden w-full">
      <div className="flex-shrink-0 h-full">
        <AdminSidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden h-full min-h-0">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto admin-scroll-container no-bounce min-h-0">
          <div className="p-6 min-h-full">
            <div className="max-w-none h-full">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}