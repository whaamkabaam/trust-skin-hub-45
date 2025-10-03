import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { CategoryBlockEditor } from '@/components/admin/CategoryBlockEditor';
import { useCategoryContent } from '@/hooks/useCategoryContent';
import { useCategories } from '@/hooks/useCategories';

export default function CategoryContent() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getCategoryBySlug } = useCategories();
  const [category, setCategory] = useState<any>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (slug) {
        const cat = await getCategoryBySlug(slug);
        setCategory(cat);
      }
    };
    fetchCategory();
  }, [slug]);

  const {
    blocks,
    loading,
    saving,
    saveBlock,
    deleteBlock,
    reorderBlocks,
    publishCategory,
  } = useCategoryContent(category?.id || '');

  const handlePublish = async () => {
    if (blocks.length === 0) {
      toast.error('Please add at least one content block before publishing');
      return;
    }
    await publishCategory();
  };

  if (loading || !category) {
    return (
      <div className="container mx-auto py-8">
        <p>Loading category...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/categories')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  Category Content Editor
                </h1>
                <p className="text-sm text-muted-foreground">
                  {category.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(`/mystery-boxes/${slug}`, '_blank')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={handlePublish}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {category.published ? 'Update' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Content Blocks</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Build your category page by adding and arranging content blocks
              </p>
              
              <Separator className="my-4" />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Blocks:</span>
                  <span className="font-medium">{blocks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">
                    {category.published ? (
                      <span className="text-green-600">Published</span>
                    ) : (
                      <span className="text-yellow-600">Draft</span>
                    )}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Editor Canvas */}
          <div className="lg:col-span-3">
            <CategoryBlockEditor
              blocks={blocks}
              onBlocksChange={reorderBlocks}
              onSaveBlock={saveBlock}
              onDeleteBlock={deleteBlock}
              categoryId={category.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
