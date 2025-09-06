import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';
import { seedSampleData } from '@/lib/sample-data-seeder';
import { useState } from 'react';

export function SeedDataButton() {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    try {
      setIsSeeding(true);
      await seedSampleData();
    } catch (error) {
      console.error('Seeding failed:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleSeed}
      disabled={isSeeding}
      className="gap-2"
    >
      <Database className="h-4 w-4" />
      {isSeeding ? 'Seeding...' : 'Seed Sample Data'}
    </Button>
  );
}