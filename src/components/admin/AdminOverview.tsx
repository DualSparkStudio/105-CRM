import {
    Assessment,
    Assignment,
    People,
    TrendingDown,
    TrendingUp,
    Warning,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DashboardStats, UserStats } from '../../types';

const AdminOverview: React.FC = () => {
  // Mock data - replace with actual API calls
  const dashboardStats: DashboardStats = {
    totalUsers: 45,
    activeUsers: 38,
    totalQuestionnaires: 12,
    activeQuestionnaires: 8,
    totalInterviews: 156,
    completedInterviews: 134,
    usersBelowThreshold: 7,
    averageCompletionRate: 85.9,
  };

  const userStats: UserStats[] = [
    {
      userId: '1',
      username: 'John Doe',
      totalInterviews: 15,
      completedInterviews: 14,
      incompleteInterviews: 1,
      completionRate: 93.3,
      lastActivity: '2024-01-15T10:30:00Z',
      isBelowThreshold: false,
    },
    {
      userId: '2',
      username: 'Jane Smith',
      totalInterviews: 8,
      completedInterviews: 6,
      incompleteInterviews: 2,
      completionRate: 75.0,
      lastActivity: '2024-01-14T15:45:00Z',
      isBelowThreshold: true,
    },
    {
      userId: '3',
      username: 'Mike Johnson',
      totalInterviews: 12,
      completedInterviews: 12,
      incompleteInterviews: 0,
      completionRate: 100.0,
      lastActivity: '2024-01-15T09:15:00Z',
      isBelowThreshold: false,
    },
  ];

  const chartData = [
    { name: 'Completed', value: dashboardStats.completedInterviews, color: '#4caf50' },
    { name: 'Incomplete', value: dashboardStats.totalInterviews - dashboardStats.completedInterviews, color: '#ff9800' },
  ];

  const performanceData = [
    { name: 'Excellent', users: 15, color: '#4caf50' },
    { name: 'Good', users: 18, color: '#2196f3' },
    { name: 'Average', users: 8, color: '#ff9800' },
    { name: 'Below Threshold', users: 7, color: '#f44336' },
  ];

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; trend?: string }> = ({ title, value, icon, color, trend }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {trend.startsWith('+') ? (
                  <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                ) : (
                  <TrendingDown sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
                )}
                <Typography variant="caption" color={trend.startsWith('+') ? 'success.main' : 'error.main'}>
                  {trend}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ color, fontSize: 40 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {dashboardStats.usersBelowThreshold > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <strong>{dashboardStats.usersBelowThreshold} users</strong> are below the minimum interview threshold.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={dashboardStats.totalUsers}
            icon={<People />}
            color="#1976d2"
            trend="+12%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Questionnaires"
            value={dashboardStats.activeQuestionnaires}
            icon={<Assignment />}
            color="#388e3c"
            trend="+5%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Interviews"
            value={dashboardStats.completedInterviews}
            icon={<Assessment />}
            color="#f57c00"
            trend="+8%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Users Below Threshold"
            value={dashboardStats.usersBelowThreshold}
            icon={<Warning />}
            color="#d32f2f"
            trend="-2%"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Interview Completion Status
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Performance Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* User Performance Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Performance Overview
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell align="right">Total Interviews</TableCell>
                      <TableCell align="right">Completed</TableCell>
                      <TableCell align="right">Completion Rate</TableCell>
                      <TableCell align="right">Last Activity</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userStats.map((user) => (
                      <TableRow key={user.userId}>
                        <TableCell component="th" scope="row">
                          {user.username}
                        </TableCell>
                        <TableCell align="right">{user.totalInterviews}</TableCell>
                        <TableCell align="right">{user.completedInterviews}</TableCell>
                        <TableCell align="right">{user.completionRate}%</TableCell>
                        <TableCell align="right">
                          {new Date(user.lastActivity).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={user.isBelowThreshold ? 'Below Threshold' : 'On Track'}
                            color={user.isBelowThreshold ? 'error' : 'success'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminOverview;
