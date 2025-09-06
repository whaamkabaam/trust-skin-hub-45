import { GlobalSearch } from '@/components/GlobalSearch';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function AdminHeader() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <GlobalSearch placeholder="Search everything..." />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}