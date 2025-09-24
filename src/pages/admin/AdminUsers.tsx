import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Users, Edit, Trash2, Copy, Check, Key, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
  current_password?: string;
  password_reset_count?: number;
  last_password_reset?: string;
}

interface CreateUserData {
  email: string;
  role: 'admin' | 'editor';
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [newUser, setNewUser] = useState<CreateUserData>({ email: '', role: 'editor' });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordCopied, setPasswordCopied] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        toast.error('Not authenticated');
        return;
      }

      const response = await supabase.functions.invoke('admin-users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (response.error) {
        throw response.error;
      }

      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.email.trim()) {
      toast.error('Email is required');
      return;
    }

    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        toast.error('Not authenticated');
        return;
      }

      const response = await supabase.functions.invoke('admin-users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: newUser,
      });

      if (response.error) {
        console.error('Create user error details:', response.error);
        throw response.error;
      }

      console.log('Create user response:', response.data);
      setGeneratedPassword(response.data.newPassword);
      setShowPasswordDialog(true);
      setShowAddDialog(false);
      setNewUser({ email: '', role: 'editor' });
      await fetchUsers();
      toast.success('User created successfully');
    } catch (error: any) {
      console.error('Error creating user:', error);
      
      // Handle specific error messages
      if (error.message?.includes('already exists')) {
        toast.error('A user with this email already exists. Please use a different email address.');
      } else if (error.message?.includes('email address has already been registered')) {
        toast.error('This email is already registered in the system. Please contact support to resolve this.');
      } else {
        toast.error(error.message || 'Failed to create user. Please try again.');
      }
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        toast.error('Not authenticated');
        return;
      }

      const response = await supabase.functions.invoke('admin-users', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: {
          id: selectedUser.id,
          role: selectedUser.role,
        },
      });

      if (response.error) {
        throw response.error;
      }

      setShowEditDialog(false);
      setSelectedUser(null);
      await fetchUsers();
      toast.success('User updated successfully');
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        toast.error('Not authenticated');
        return;
      }

      const response = await supabase.functions.invoke('admin-users', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: {
          id: selectedUser.id,
        },
      });

      if (response.error) {
        throw response.error;
      }

      setShowDeleteDialog(false);
      setSelectedUser(null);
      await fetchUsers();
      toast.success('User deleted successfully');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        toast.error('Not authenticated');
        return;
      }

      console.log('Resetting password for user:', selectedUser);

      const response = await supabase.functions.invoke('admin-users', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: {
          id: selectedUser.id,
        },
      });

      if (response.error) {
        console.error('Reset password error details:', response.error);
        throw response.error;
      }

      const { user, newPassword } = response.data;
      setGeneratedPassword(newPassword);
      
      // Update the user in the list
      setUsers(users.map(u => u.id === selectedUser.id ? user : u));
      
      toast.success('Password reset successfully');
      setShowResetPasswordDialog(false);
      setShowPasswordDialog(true);
      setSelectedUser(user);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      
      // Handle specific error messages
      if (error.message?.includes('User not found')) {
        toast.error('User not found. Please refresh the page and try again.');
      } else if (error.message?.includes('Invalid user ID')) {
        toast.error('Invalid user data. Please refresh the page and try again.');
      } else {
        toast.error(error.message || 'Failed to reset password. Please try again.');
      }
    }
  };

  const copyPassword = async (password?: string) => {
    const passwordToCopy = password || generatedPassword;
    try {
      await navigator.clipboard.writeText(passwordToCopy);
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
      toast.success('Password copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy password');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Users</h1>
          <p className="text-muted-foreground">Manage admin users and passwords</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            Manage admin users, roles, and passwords
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No admin users found</p>
              <p className="text-sm">Add your first admin user to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Password
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPasswords(!showPasswords)}
                      >
                        {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell>
                      {showPasswords && user.current_password ? (
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {user.current_password}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyPassword(user.current_password!)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          {showPasswords ? 'No password stored' : '••••••••'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowResetPasswordDialog(true);
                          }}
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Admin User</DialogTitle>
            <DialogDescription>
              Create a new admin user with access to the dashboard. A random password will be generated.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={newUser.role} onValueChange={(value: 'admin' | 'editor') => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user's role and permissions.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={selectedUser.email} disabled />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select 
                  value={selectedUser.role} 
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedUser?.email}"? This action cannot be undone.
              The user will lose access to the admin dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser}>
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Confirmation Dialog */}
      <Dialog open={showResetPasswordDialog} onOpenChange={setShowResetPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to reset the password for <strong>{selectedUser?.email}</strong>?</p>
            <p className="text-sm text-muted-foreground">
              A new random password will be generated and you'll be able to view and copy it.
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowResetPasswordDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleResetPassword}>
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Display Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.current_password ? 'Password Reset Successfully' : 'User Created Successfully'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.current_password 
                ? 'The password has been reset. Here is the new password:' 
                : 'The user has been created with the following temporary password. Make sure to share this securely with the user.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Generated Password</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={generatedPassword}
                  readOnly
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyPassword()}
                  className="shrink-0"
                >
                  {passwordCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Important:</strong> You can view this password anytime by toggling the password visibility in the table.
                Make sure to share it securely with the user.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPasswordDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}