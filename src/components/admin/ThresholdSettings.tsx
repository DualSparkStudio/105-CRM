import {
    CheckCircle,
    Error,
    Save,
    TrendingDown,
    TrendingUp,
    Warning,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    FormControlLabel,
    Grid,
    LinearProgress,
    Paper,
    Switch,
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
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { ThresholdConfig, UserStats } from '../../types';

const validationSchema = yup.object({
  minInterviews: yup.number().required('Minimum interviews is required').min(1, 'Must be at least 1'),
  warningThreshold: yup.number().required('Warning threshold is required').min(1, 'Must be at least 1'),
});

const ThresholdSettings: React.FC = () => {
  const [isActive, setIsActive] = useState(true);

  // Mock data - replace with actual API calls
  const [thresholdConfig, setThresholdConfig] = useState<ThresholdConfig>({
    id: '1',
    minInterviews: 10,
    warningThreshold: 8,
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true,
  });

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
    {
      userId: '4',
      username: 'Sarah Wilson',
      totalInterviews: 5,
      completedInterviews: 3,
      incompleteInterviews: 2,
      completionRate: 60.0,
      lastActivity: '2024-01-13T14:20:00Z',
      isBelowThreshold: true,
    },
    {
      userId: '5',
      username: 'David Brown',
      totalInterviews: 7,
      completedInterviews: 5,
      incompleteInterviews: 2,
      completionRate: 71.4,
      lastActivity: '2024-01-14T11:30:00Z',
      isBelowThreshold: true,
    },
  ];

  const formik = useFormik({
    initialValues: {
      minInterviews: thresholdConfig.minInterviews,
      warningThreshold: thresholdConfig.warningThreshold,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const updatedConfig: ThresholdConfig = {
        ...thresholdConfig,
        minInterviews: values.minInterviews,
        warningThreshold: values.warningThreshold,
        isActive,
      };
      setThresholdConfig(updatedConfig);
      toast.success('Threshold settings updated successfully!');
    },
  });

  const usersBelowThreshold = userStats.filter(user => user.isBelowThreshold);
  const usersAtWarningLevel = userStats.filter(user => 
    user.totalInterviews >= thresholdConfig.warningThreshold && 
    user.totalInterviews < thresholdConfig.minInterviews
  );

  const getPerformanceCategory = (user: UserStats) => {
    if (user.totalInterviews >= thresholdConfig.minInterviews) {
      return { category: 'Excellent', color: 'success', icon: <CheckCircle /> };
    } else if (user.totalInterviews >= thresholdConfig.warningThreshold) {
      return { category: 'Warning', color: 'warning', icon: <Warning /> };
    } else {
      return { category: 'Critical', color: 'error', icon: <Error /> };
    }
  };

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 90) return 'success';
    if (rate >= 75) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Threshold Settings
      </Typography>

      {/* Current Status Alert */}
      {usersBelowThreshold.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <strong>{usersBelowThreshold.length} users</strong> are currently below the minimum interview threshold of {thresholdConfig.minInterviews} interviews.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Threshold Configuration */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Threshold Configuration
              </Typography>
              
              <Box component="form" onSubmit={formik.handleSubmit}>
                <TextField
                  fullWidth
                  id="minInterviews"
                  name="minInterviews"
                  label="Minimum Interviews Required"
                  type="number"
                  value={formik.values.minInterviews}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.minInterviews && Boolean(formik.errors.minInterviews)}
                  helperText={formik.touched.minInterviews && formik.errors.minInterviews}
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  id="warningThreshold"
                  name="warningThreshold"
                  label="Warning Threshold"
                  type="number"
                  value={formik.values.warningThreshold}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.warningThreshold && Boolean(formik.errors.warningThreshold)}
                  helperText={formik.touched.warningThreshold && formik.errors.warningThreshold}
                  margin="normal"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                  }
                  label="Enable threshold monitoring"
                  sx={{ mt: 2 }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  fullWidth
                  sx={{ mt: 3 }}
                  disabled={formik.isSubmitting}
                >
                  Save Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Threshold Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Statistics
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="h4" color="white">
                      {userStats.filter(u => !u.isBelowThreshold).length}
                    </Typography>
                    <Typography variant="body2" color="white">
                      Users Above Threshold
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                    <Typography variant="h4" color="white">
                      {usersBelowThreshold.length}
                    </Typography>
                    <Typography variant="body2" color="white">
                      Users Below Threshold
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                    <Typography variant="h4" color="white">
                      {usersAtWarningLevel.length}
                    </Typography>
                    <Typography variant="body2" color="white">
                      At Warning Level
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="h4" color="white">
                      {Math.round(userStats.reduce((acc, user) => acc + user.completionRate, 0) / userStats.length)}
                    </Typography>
                    <Typography variant="body2" color="white">
                      Avg Completion Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* User Performance Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Performance vs Threshold
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell align="right">Total Interviews</TableCell>
                      <TableCell align="right">Required</TableCell>
                      <TableCell align="right">Completion Rate</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Progress</TableCell>
                      <TableCell align="center">Performance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userStats.map((user) => {
                      const performance = getPerformanceCategory(user);
                      return (
                        <TableRow 
                          key={user.userId}
                          sx={{ 
                            bgcolor: user.isBelowThreshold ? 'error.50' : 'inherit',
                            '&:hover': { bgcolor: user.isBelowThreshold ? 'error.100' : 'grey.50' }
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {performance.icon}
                              <Typography sx={{ ml: 1 }}>
                                {user.username}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              {user.totalInterviews}
                              {user.totalInterviews >= thresholdConfig.minInterviews ? (
                                <TrendingUp sx={{ color: 'success.main', ml: 1, fontSize: 16 }} />
                              ) : (
                                <TrendingDown sx={{ color: 'error.main', ml: 1, fontSize: 16 }} />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            {thresholdConfig.minInterviews}
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${user.completionRate}%`}
                              color={getCompletionRateColor(user.completionRate) as any}
                              size="small"
                            />
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
                                value={Math.min((user.totalInterviews / thresholdConfig.minInterviews) * 100, 100)}
                                color={user.totalInterviews >= thresholdConfig.minInterviews ? 'success' : 'error'}
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={performance.category}
                              color={performance.color as any}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Threshold Guidelines */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Threshold Guidelines
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '2px solid', borderColor: 'success.main', borderRadius: 1 }}>
                    <Typography variant="subtitle1" color="success.main" gutterBottom>
                      <CheckCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Excellent Performance
                    </Typography>
                    <Typography variant="body2">
                      Users with {thresholdConfig.minInterviews}+ interviews completed.
                      These users are meeting or exceeding expectations.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '2px solid', borderColor: 'warning.main', borderRadius: 1 }}>
                    <Typography variant="subtitle1" color="warning.main" gutterBottom>
                      <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Warning Level
                    </Typography>
                    <Typography variant="body2">
                      Users with {thresholdConfig.warningThreshold}-{thresholdConfig.minInterviews - 1} interviews.
                      These users need attention and support.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '2px solid', borderColor: 'error.main', borderRadius: 1 }}>
                    <Typography variant="subtitle1" color="error.main" gutterBottom>
                      <Error sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Critical Level
                    </Typography>
                    <Typography variant="body2">
                      Users with less than {thresholdConfig.warningThreshold} interviews.
                      These users require immediate intervention.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ThresholdSettings;
