import { GlobalSearch } from '@/components/GlobalSearch';

export function AdminHeader() {
  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </div>
        
        <div className="ml-auto">
          <GlobalSearch placeholder="Search everything..." />
        </div>
      </div>
    </header>
  );
}