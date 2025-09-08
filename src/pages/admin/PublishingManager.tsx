import { PublishingDashboard } from '@/components/admin/PublishingDashboard';

export default function PublishingManager() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Publishing Manager</h1>
        <p className="text-muted-foreground">
          Manage static content publishing for operators to optimize SEO and performance.
        </p>
      </div>
      
      <PublishingDashboard />
    </div>
  );
}