import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  FileText,
  Image,
  Search,
  Star,
  Users,
  Globe,
  Tag,
  CreditCard,
  Box,
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Operators',
    href: '/admin/operators',
    icon: Building2,
  },
  {
    title: 'Mystery Boxes',
    href: '/admin/mystery-boxes',
    icon: Box,
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: Tag,
  },
  {
    title: 'Payment Methods',
    href: '/admin/payment-methods',
    icon: CreditCard,
  },
  {
    title: 'Publishing',
    href: '/admin/publishing',
    icon: Globe,
  },
  {
    title: 'Content Sections',
    href: '/admin/content',
    icon: FileText,
  },
  {
    title: 'Media Library',
    href: '/admin/media',
    icon: Image,
  },
  {
    title: 'SEO Manager',
    href: '/admin/seo',
    icon: Search,
  },
  {
    title: 'Reviews',
    href: '/admin/reviews',
    icon: Star,
  },
  {
    title: 'Admin Users',
    href: '/admin/users',
    icon: Users,
  },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 p-6 pb-4 flex-shrink-0">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">U</span>
        </div>
        <div>
          <h2 className="font-semibold text-sidebar-foreground">Unpacked.gg</h2>
          <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-6 pb-6" style={{ scrollbarGutter: 'stable' }}>
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/admin' && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}