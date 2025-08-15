import {
    Add,
    Delete,
    Edit,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { User } from '../../types';
import { userService } from '../../services/api';

const validationSchema = yup.object({
  username: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  role: yup.string().required('Role is required'),
});

const UserManagement: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  // Real data from Supabase
  const [users, setUsers] = useState<User[]>([]);

  // Load users from database
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const usersData = await userService.getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      role: 'user' as 'admin' | 'user',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingUser) {
          // Update existing user
          await userService.updateUser(editingUser.id, {
            username: values.username,
            email: values.email,
            role: values.role,
          });
          toast.success('User updated successfully!');
        } else {
          // Create new user
          await userService.createUser({
            username: values.username,
            email: values.email,
            password: values.password,
            role: values.role,
          });
          toast.success('User created successfully!');
        }
        
        // Reload users
        const usersData = await userService.getUsers();
        setUsers(usersData);
        
        handleCloseDialog();
      } catch (error) {
        console.error('Error saving user:', error);
        toast.error('Failed to save user');
      }
    },
  });

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      formik.setValues({
        username: user.username,
        email: user.email,
        password: '',
        role: user.role,
      });
    } else {
      setEditingUser(null);
      formik.resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setShowPassword(false);
    formik.resetForm();
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        await userService.updateUser(userId, { isActive: !user.isActive });
        const usersData = await userService.getUsers();
        setUsers(usersData);
        toast.success('User status updated!');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        const usersData = await userService.getUsers();
        setUsers(usersData);
        toast.success('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const getCompletionRate = (user: User) => {
    if (user.interviewCount === 0) return 0;
    return Math.round((user.completedForms / user.interviewCount) * 100);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading users...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">User Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add New User
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Interviews</TableCell>
                  <TableCell align="right">Completion Rate</TableCell>
                  <TableCell align="right">Created</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell component="th" scope="row">
                      {user.username}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={user.role === 'admin' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? 'Active' : 'Inactive'}
                        color={user.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {user.interviewCount} ({user.completedForms} completed)
                    </TableCell>
                    <TableCell align="right">
                      {getCompletionRate(user)}%
                    </TableCell>
                    <TableCell align="right">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(user)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleUserStatus(user.id)}
                        color={user.isActive ? 'warning' : 'success'}
                      >
                        {user.isActive ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteUser(user.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Create New User'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              id="username"
              name="username"
              label="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              margin="normal"
              disabled={!!editingUser}
            />
            
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
            />
            
            {!editingUser && (
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            )}
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.role && Boolean(formik.errors.role)}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={() => formik.handleSubmit()}
            variant="contained"
            disabled={formik.isSubmitting}
          >
            {editingUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
