import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
};

interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface CreateUserRequest {
  email: string;
  role: 'admin' | 'editor';
}

interface UpdateUserRequest {
  id: string;
  role: 'admin' | 'editor';
}

function generateRandomPassword(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user is an admin
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin by querying admin_users table directly
    const { data: adminCheck, error: adminError } = await supabaseClient
      .from('admin_users')
      .select('role')
      .eq('email', user.email.toLowerCase())
      .eq('role', 'admin')
      .single();

    if (adminError || !adminCheck) {
      console.error('Admin check failed:', adminError?.message || 'User not found in admin_users');
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const method = req.method;

    switch (method) {
      case 'GET':
        // List admin users
        const { data: users, error: listError } = await supabaseClient
          .from('admin_users')
          .select('*')
          .order('created_at', { ascending: false });

        if (listError) {
          console.error('Error listing users:', listError);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch users' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ users }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'POST':
        // Create new admin user
        const createData: CreateUserRequest = await req.json();
        const { email, role } = createData;

        if (!email || !role) {
          return new Response(
            JSON.stringify({ error: 'Email and role are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Generate random password
        const password = generateRandomPassword();

        // Create user in Supabase Auth
        const { data: newUser, error: createAuthError } = await supabaseClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true
        });

        if (createAuthError) {
          console.error('Error creating auth user:', createAuthError);
          return new Response(
            JSON.stringify({ error: createAuthError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Add to admin_users table with password
        const { data: adminUser, error: adminUserError } = await supabaseClient
          .from('admin_users')
          .insert([{ 
            email: email.toLowerCase(), 
            role,
            current_password: password,
            password_reset_count: 0,
            last_password_reset: new Date().toISOString()
          }])
          .select()
          .single();

        if (adminUserError) {
          console.error('Error creating admin user:', adminUserError);
          // Clean up auth user if admin_users insert failed
          await supabaseClient.auth.admin.deleteUser(newUser.user.id);
          return new Response(
            JSON.stringify({ error: 'Failed to create admin user' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ 
            user: adminUser, 
            newPassword: password,
            message: 'User created successfully'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'PUT':
        // Update user role
        const updateData: UpdateUserRequest = await req.json();
        const { id, role: newRole } = updateData;

        if (!id || !newRole) {
          return new Response(
            JSON.stringify({ error: 'ID and role are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: updatedUser, error: updateError } = await supabaseClient
          .from('admin_users')
          .update({ role: newRole, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating user:', updateError);
          return new Response(
            JSON.stringify({ error: 'Failed to update user' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ user: updatedUser, message: 'User updated successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'PATCH':
        // Reset user password
        const resetData = await req.json();
        const resetId = resetData.id;
        
        if (!resetId) {
          return new Response(
            JSON.stringify({ error: 'User ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        try {
          // Get user from admin_users table
          const { data: adminUser, error: getUserError } = await supabaseClient
            .from('admin_users')
            .select('email, password_reset_count')
            .eq('id', resetId)
            .single();

          if (getUserError || !adminUser) {
            return new Response(
              JSON.stringify({ error: 'User not found' }),
              { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Generate new password
          const newPassword = generateRandomPassword();

          // Get the auth user ID by email
          const { data: authUsers, error: authUserError } = await supabaseClient.auth.admin.listUsers();
          if (authUserError) {
            return new Response(
              JSON.stringify({ error: 'Failed to find auth user' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          const authUser = authUsers.users.find(u => u.email?.toLowerCase() === adminUser.email.toLowerCase());
          if (!authUser) {
            return new Response(
              JSON.stringify({ error: 'Auth user not found' }),
              { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Update password in Supabase Auth
          const { error: updateAuthError } = await supabaseClient.auth.admin.updateUserById(
            authUser.id,
            { password: newPassword }
          );

          if (updateAuthError) {
            console.error('Error updating password in Auth:', updateAuthError);
            return new Response(
              JSON.stringify({ error: updateAuthError.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Update password in admin_users table
          const { data: updatedUser, error: updateUserError } = await supabaseClient
            .from('admin_users')
            .update({
              current_password: newPassword,
              password_reset_count: (adminUser.password_reset_count || 0) + 1,
              last_password_reset: new Date().toISOString(),
            })
            .eq('id', resetId)
            .select()
            .single();

          if (updateUserError) {
            console.error('Error updating admin user:', updateUserError);
            return new Response(
              JSON.stringify({ error: updateUserError.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify({ 
              user: updatedUser,
              newPassword: newPassword 
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (error) {
          console.error('Unexpected error during password reset:', error);
          return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      case 'DELETE':
        // Delete user
        const deleteData = await req.json();
        const deleteId = deleteData.id;
        
        if (!deleteId) {
          return new Response(
            JSON.stringify({ error: 'User ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get user email first
        const { data: userToDelete, error: getUserError } = await supabaseClient
          .from('admin_users')
          .select('email')
          .eq('id', deleteId)
          .single();

        if (getUserError || !userToDelete) {
          return new Response(
            JSON.stringify({ error: 'User not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Delete from admin_users table
        const { error: deleteError } = await supabaseClient
          .from('admin_users')
          .delete()
          .eq('id', deleteId);

        if (deleteError) {
          console.error('Error deleting user:', deleteError);
          return new Response(
            JSON.stringify({ error: 'Failed to delete user' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ message: 'User deleted successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});