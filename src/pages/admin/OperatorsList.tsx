import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOperators } from '@/hooks/useOperators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Search, Edit, Trash2, Eye, MoreHorizontal, Copy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { TableSkeleton } from '@/components/ui/skeleton';
import { ConfirmDialog, BulkConfirmDialog } from '@/components/ConfirmDialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SeedDataButton } from '@/components/admin/SeedDataButton';

export default function OperatorsList() {
  const { operators, loading, deleteOperator, duplicateOperator } = useOperators();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOperators, setSelectedOperators] = useState<Set<string>>(new Set());

  const filteredOperators = operators.filter((operator) =>
    operator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operator.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    await deleteOperator(id);
  };

  const handleBulkDelete = async () => {
    for (const id of selectedOperators) {
      await deleteOperator(id);
    }
    setSelectedOperators(new Set());
  };

  const handleDuplicate = async (id: string) => {
    try {
      const newOperator = await duplicateOperator(id);
      // Navigate to edit the duplicated operator
      window.location.href = `/admin/operators/${newOperator.id}`;
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  const handleSelectAll = () => {
    if (selectedOperators.size === filteredOperators.length) {
      setSelectedOperators(new Set());
    } else {
      setSelectedOperators(new Set(filteredOperators.map(op => op.id)));
    }
  };

  const toggleOperatorSelection = (id: string) => {
    const newSelection = new Set(selectedOperators);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedOperators(newSelection);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Operators</h1>
            <p className="text-muted-foreground">Manage your gambling operators</p>
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            New Operator
          </Button>
        </div>
        <TableSkeleton rows={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Operators</h1>
          <p className="text-muted-foreground">Manage your gambling operators</p>
        </div>
        <div className="flex gap-2">
          <SeedDataButton />
          <Button asChild>
            <Link to="/admin/operators/new">
              <Plus className="h-4 w-4 mr-2" />
              New Operator
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search operators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        {selectedOperators.size > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedOperators.size} selected
            </span>
            <BulkConfirmDialog
              title="Delete Operators"
              description="Are you sure you want to delete {count} operators? This action cannot be undone."
              onConfirm={handleBulkDelete}
              selectedCount={selectedOperators.size}
              variant="destructive"
              confirmText="Delete All"
            >
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </BulkConfirmDialog>
          </div>
        )}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedOperators.size === filteredOperators.length && filteredOperators.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Overall Rating</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOperators.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-muted-foreground">
                    {searchTerm ? 'No operators found matching your search.' : 'No operators yet.'}
                  </div>
                  {!searchTerm && (
                    <Button asChild className="mt-4">
                      <Link to="/admin/operators/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Create your first operator
                      </Link>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredOperators.map((operator) => (
                <TableRow key={operator.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedOperators.has(operator.id)}
                      onCheckedChange={() => toggleOperatorSelection(operator.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {operator.logo_url && (
                        <img
                          src={operator.logo_url}
                          alt={operator.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <span>{operator.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{operator.slug}</TableCell>
                  <TableCell>
                    <Badge variant={operator.published ? 'default' : 'secondary'}>
                      {operator.published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {operator.ratings && typeof operator.ratings === 'object' && 'overall' in operator.ratings
                      ? `${operator.ratings.overall}/10`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(operator.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {operator.published && (
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/operators/${operator.slug}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/admin/operators/${operator.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <ConfirmDialog
                        title="Delete Operator"
                        description={`Are you sure you want to delete "${operator.name}"? This action cannot be undone.`}
                        onConfirm={() => handleDelete(operator.id)}
                        variant="destructive"
                        confirmText="Delete"
                      >
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </ConfirmDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDuplicate(operator.id)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate Operator
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/operators/${operator.id}/content`}>
                              Manage Content
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/operators/${operator.id}/seo`}>
                              SEO Settings
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}