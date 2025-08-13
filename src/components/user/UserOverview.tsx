import {
    Assignment,
    CheckCircle,
    Schedule,
    Star,
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
    Divider,
    Grid,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';

const UserOverview: React.FC = () => {
  const { user } = useAuth();

  // Mock data - replace with actual API calls
  const userStats = {
    totalInterviews: 15,
    completedInterviews: 14,
    incompleteInterviews: 1,
    completionRate: 93.3,
    averageScore: 4.2,
    lastActivity: '2024-01-15T10:30:00Z',
    isBelowThreshold: false,
    minRequired: 10,
  };

  const recentActivity = [
    {
      id: '1',
      type: 'completed',
      title: 'Customer Satisfaction Survey',
      date: '2024-01-15T10:30:00Z',
      score: 4.5,
    },
    {
      id: '2',
      type: 'incomplete',
      title: 'Product Feedback Form',
      date: '2024-01-14T15:45:00Z',
      progress: 60,
    },
    {
      id: '3',
      type: 'completed',
      title: 'Service Quality Assessment',
      date: '2024-01-13T09:20:00Z',
      score: 4.0,
    },
  ];

  const chartData = [
    { name: 'Completed', value: userStats.completedInterviews, color: '#4caf50' },
    { name: 'Incomplete', value: userStats.incompleteInterviews, color: '#ff9800' },
  ];

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'completed': return 'success';
      case 'incomplete': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'completed': return <CheckCircle />;
      case 'incomplete': return <Warning />;
      default: return <Assignment />;
    }
  };

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; subtitle?: string }> = ({ title, value, icon, color, subtitle }) => (
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
            {subtitle && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
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
        Welcome back, {user?.username}!
      </Typography>

      {userStats.isBelowThreshold && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You are currently below the minimum interview threshold. Please complete more interviews to meet the requirement.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Interviews"
            value={userStats.totalInterviews}
            icon={<Assignment />}
            color="#1976d2"
            subtitle={`${userStats.minRequired} required`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={userStats.completedInterviews}
            icon={<CheckCircle />}
            color="#4caf50"
            subtitle={`${userStats.completionRate}% success rate`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Incomplete"
            value={userStats.incompleteInterviews}
            icon={<Warning />}
            color="#ff9800"
            subtitle="Needs attention"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Score"
            value={userStats.averageScore}
            icon={<Star />}
            color="#f57c00"
            subtitle="Out of 5.0"
          />
        </Grid>

        {/* Progress Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Interview Progress
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Progress to Goal</Typography>
                  <Typography variant="body2">
                    {userStats.totalInterviews}/{userStats.minRequired} ({Math.round((userStats.totalInterviews / userStats.minRequired) * 100)}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((userStats.totalInterviews / userStats.minRequired) * 100, 100)}
                  color={userStats.totalInterviews >= userStats.minRequired ? 'success' : 'primary'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Completion Rate</Typography>
                  <Typography variant="body2">{userStats.completionRate}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={userStats.completionRate}
                  color={userStats.completionRate >= 90 ? 'success' : userStats.completionRate >= 75 ? 'warning' : 'error'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                {userStats.totalInterviews >= userStats.minRequired ? (
                  <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                ) : (
                  <TrendingDown sx={{ color: 'warning.main', mr: 1 }} />
                )}
                <Typography variant="body2" color={userStats.totalInterviews >= userStats.minRequired ? 'success.main' : 'warning.main'}>
                  {userStats.totalInterviews >= userStats.minRequired 
                    ? 'You are on track to meet your goals!' 
                    : `${userStats.minRequired - userStats.totalInterviews} more interviews needed`
                  }
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Completion Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Interview Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
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

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Chip
                          icon={getStatusIcon(activity.type)}
                          label={activity.type}
                          color={getStatusColor(activity.type) as any}
                          size="small"
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.title}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Schedule sx={{ fontSize: 16, mr: 0.5 }} />
                            {new Date(activity.date).toLocaleDateString()}
                            {activity.type === 'completed' && activity.score && (
                              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                                <Star sx={{ fontSize: 16, mr: 0.5, color: 'gold' }} />
                                <Typography variant="body2">{activity.score}/5.0</Typography>
                              </Box>
                            )}
                            {activity.type === 'incomplete' && activity.progress && (
                              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                                <Typography variant="body2" color="warning.main">
                                  {activity.progress}% complete
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserOverview;
