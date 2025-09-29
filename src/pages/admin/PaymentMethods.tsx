import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { usePaymentMethods, PaymentMethodFormData } from '@/hooks/usePaymentMethods';
import { generateUniqueOperatorSlug } from '@/lib/utils';
import { SEOHead } from '@/components/SEOHead';

const PaymentMethods = () => {
  const { paymentMethods, loading, createPaymentMethod, updatePaymentMethod, deletePaymentMethod } = usePaymentMethods();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingMethod, setEditingMethod] = useState<string | null>(null);
  const [formData, setFormData] = useState<PaymentMethodFormData>({
    name: '',
    slug: '',
    logo_url: '',
    description_rich: '',
    display_order: 0,
    is_featured: false,
  });

  const filteredMethods = paymentMethods.filter(method =>
    method.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    method.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingMethod) {
        await updatePaymentMethod(editingMethod, formData);
      } else {
        // Generate unique slug if not provided
        if (!formData.slug && formData.name) {
          const existingSlugs = paymentMethods.map(m => m.slug);
          formData.slug = generateUniqueOperatorSlug(formData.name, existingSlugs);
        }
        await createPaymentMethod(formData);
      }
      
      resetForm();
      setShowDialog(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      logo_url: '',
      description_rich: '',
      display_order: 0,
      is_featured: false,
    });
    setEditingMethod(null);
  };

  const handleEdit = (method: any) => {
    setFormData({
      name: method.name,
      slug: method.slug,
      logo_url: method.logo_url || '',
      description_rich: method.description_rich || '',
      display_order: method.display_order,
      is_featured: method.is_featured,
    });
    setEditingMethod(method.id);
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    await deletePaymentMethod(id);
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }));
  };

  return (
    <>
      <SEOHead 
        title="Payment Methods Management | Admin Dashboard"
        description="Manage operator payment methods, create new payment options, and organize payment taxonomy."
      />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Payment Methods</h1>
            <p className="text-muted-foreground mt-1">
              Manage payment methods for operators and services
            </p>
          </div>
          
          <Dialog open={showDialog} onOpenChange={(open) => {
            setShowDialog(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingMethod ? 'Edit Payment Method' : 'Add New Payment Method'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Payment method name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="payment-method-slug"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    URL-friendly identifier (auto-generated from name)
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description_rich}
                    onChange={(e) => setFormData(prev => ({ ...prev, description_rich: e.target.value }))}
                    placeholder="Payment method description and details"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                  />
                  <Label htmlFor="featured">Featured Payment Method</Label>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingMethod ? 'Update' : 'Create'} Payment Method
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payment methods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Payment Methods ({filteredMethods.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading payment methods...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Operators</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMethods.map((method) => (
                    <TableRow key={method.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {method.logo_url && (
                            <img 
                              src={method.logo_url} 
                              alt={method.name} 
                              className="w-8 h-8 rounded object-cover"
                            />
                          )}
                          <span className="font-medium">{method.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {method.slug}
                        </code>
                      </TableCell>
                      <TableCell>{method.display_order}</TableCell>
                      <TableCell>
                        {method.is_featured ? (
                          <Badge variant="default">
                            <Eye className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Regular
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">0 operators</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(method)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{method.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(method.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            {!loading && filteredMethods.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No payment methods match your search.' : 'No payment methods created yet.'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PaymentMethods;