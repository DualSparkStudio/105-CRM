import {
    CheckCircle,
    Error,
    ExpandMore,
    FilterList,
    TrendingDown,
    TrendingUp,
    Warning
} from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    FormControl,
    Grid,
    InputLabel,
    LinearProgress,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { InterviewResponse, Questionnaire, UserStats } from '../../types';

const InterviewAnalytics: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('30');

  // Mock data - replace with actual API calls
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

  const interviewResponses: InterviewResponse[] = [
    {
      id: '1',
      questionnaireId: '1',
      userId: '1',
      responses: [
        { questionId: '1', answer: 'Very Satisfied' },
        { questionId: '2', answer: 'Customer service could be improved' },
      ],
      status: 'completed',
      submittedAt: '2024-01-15T10:30:00Z',
      lastModified: '2024-01-15T10:30:00Z',
      completionPercentage: 100,
    },
    {
      id: '2',
      questionnaireId: '1',
      userId: '2',
      responses: [
        { questionId: '1', answer: 'Satisfied' },
      ],
      status: 'incomplete',
      lastModified: '2024-01-14T15:45:00Z',
      completionPercentage: 50,
    },
  ];

  const questionnaires: Questionnaire[] = [
    {
      id: '1',
      title: 'Customer Satisfaction Survey',
      description: 'Survey to measure customer satisfaction',
      questions: [],
      createdAt: '2024-01-01T00:00:00Z',
      isActive: true,
      assignedTo: [],
    },
    {
      id: '2',
      title: 'Product Feedback Form',
      description: 'Product feedback collection',
      questions: [],
      createdAt: '2024-01-05T00:00:00Z',
      isActive: true,
      assignedTo: [],
    },
  ];

  const performanceData = [
    { name: 'Excellent (90-100%)', users: 15, color: '#4caf50' },
    { name: 'Good (75-89%)', users: 18, color: '#2196f3' },
    { name: 'Average (60-74%)', users: 8, color: '#ff9800' },
    { name: 'Below Threshold (<60%)', users: 7, color: '#f44336' },
  ];

  const completionTrendData = [
    { date: 'Jan 1', completed: 12, incomplete: 3 },
    { date: 'Jan 2', completed: 15, incomplete: 2 },
    { date: 'Jan 3', completed: 18, incomplete: 1 },
    { date: 'Jan 4', completed: 22, incomplete: 0 },
    { date: 'Jan 5', completed: 25, incomplete: 2 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'incomplete': return 'warning';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'incomplete': return <Warning />;
      case 'draft': return <Error />;
      default: return <Error />;
    }
  };

  const filteredResponses = interviewResponses.filter(response => {
    if (selectedUser !== 'all' && response.userId !== selectedUser) return false;
    if (selectedQuestionnaire !== 'all' && response.questionnaireId !== selectedQuestionnaire) return false;
    return true;
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Interview Analytics
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by User</InputLabel>
                <Select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <MenuItem value="all">All Users</MenuItem>
                  {userStats.map(user => (
                    <MenuItem key={user.userId} value={user.userId}>
                      {user.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Questionnaire</InputLabel>
                <Select
                  value={selectedQuestionnaire}
                  onChange={(e) => setSelectedQuestionnaire(e.target.value)}
                >
                  <MenuItem value="all">All Questionnaires</MenuItem>
                  {questionnaires.map(q => (
                    <MenuItem key={q.id} value={q.id}>
                      {q.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <MenuItem value="7">Last 7 days</MenuItem>
                  <MenuItem value="30">Last 30 days</MenuItem>
                  <MenuItem value="90">Last 90 days</MenuItem>
                  <MenuItem value="365">Last year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                fullWidth
              >
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Performance Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="users"
                    label={({ name, users }) => `${name}: ${users}`}
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Completion Trend */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Completion Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={completionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="completed" stroke="#4caf50" strokeWidth={2} />
                  <Line type="monotone" dataKey="incomplete" stroke="#ff9800" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* User Performance Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Performance Details
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell align="right">Total Interviews</TableCell>
                      <TableCell align="right">Completed</TableCell>
                      <TableCell align="right">Incomplete</TableCell>
                      <TableCell align="right">Completion Rate</TableCell>
                      <TableCell align="right">Last Activity</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Progress</TableCell>
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
                        <TableCell align="right">{user.incompleteInterviews}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            {user.completionRate}%
                            {user.completionRate >= 90 ? (
                              <TrendingUp sx={{ color: 'success.main', ml: 1, fontSize: 16 }} />
                            ) : (
                              <TrendingDown sx={{ color: 'error.main', ml: 1, fontSize: 16 }} />
                            )}
                          </Box>
                        </TableCell>
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
                        <TableCell align="center">
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={user.completionRate}
                              color={user.completionRate >= 90 ? 'success' : user.completionRate >= 75 ? 'warning' : 'error'}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Interview Responses */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Interview Responses Detail
              </Typography>
              {filteredResponses.map((response) => (
                <Accordion key={response.id} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Chip
                        icon={getStatusIcon(response.status)}
                        label={response.status}
                        color={getStatusColor(response.status) as any}
                        size="small"
                        sx={{ mr: 2 }}
                      />
                      <Typography sx={{ flexGrow: 1 }}>
                        Response ID: {response.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {response.completionPercentage}% Complete
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Completion Progress
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={response.completionPercentage}
                        color={response.completionPercentage === 100 ? 'success' : 'warning'}
                        sx={{ mb: 2 }}
                      />
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Responses:
                      </Typography>
                      {response.responses.map((resp, index) => (
                        <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Question {index + 1}:
                          </Typography>
                          <Typography variant="body1">
                            {Array.isArray(resp.answer) ? resp.answer.join(', ') : resp.answer}
                          </Typography>
                        </Box>
                      ))}
                      
                      <Typography variant="caption" color="text.secondary">
                        Last modified: {new Date(response.lastModified).toLocaleString()}
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InterviewAnalytics;
