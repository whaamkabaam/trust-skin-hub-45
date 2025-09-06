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
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function OperatorsList() {
  const { operators, loading, deleteOperator } = useOperators();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOperators = operators.filter((operator) =>
    operator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operator.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    await deleteOperator(id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading operators...</p>
        </div>
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
        <Button asChild>
          <Link to="/admin/operators/new">
            <Plus className="h-4 w-4 mr-2" />
            New Operator
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search operators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
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
                <TableCell colSpan={6} className="text-center py-8">
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Operator</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{operator.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(operator.id)}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}