import {
    Assignment,
    CheckCircle,
    Error,
    ExpandMore,
    Schedule,
    Visibility,
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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { InterviewResponse, Questionnaire } from '../../types';

const MyProgress: React.FC = () => {
  const [selectedResponse, setSelectedResponse] = useState<InterviewResponse | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Mock data - replace with actual API calls
  const userResponses: InterviewResponse[] = [
    {
      id: '1',
      questionnaireId: '1',
      userId: '1',
      responses: [
        { questionId: '1', answer: 'Very Satisfied' },
        { questionId: '2', answer: 'Customer service could be improved' },
        { questionId: '3', answer: ['Feature A', 'Feature B'] },
        { questionId: '4', answer: 'Excellent' },
      ],
      status: 'completed',
      submittedAt: '2024-01-15T10:30:00Z',
      lastModified: '2024-01-15T10:30:00Z',
      completionPercentage: 100,
    },
    {
      id: '2',
      questionnaireId: '2',
      userId: '1',
      responses: [
        { questionId: '5', answer: 'Likely' },
      ],
      status: 'incomplete',
      lastModified: '2024-01-14T15:45:00Z',
      completionPercentage: 50,
    },
    {
      id: '3',
      questionnaireId: '3',
      userId: '1',
      responses: [],
      status: 'draft',
      lastModified: '2024-01-13T09:20:00Z',
      completionPercentage: 0,
    },
  ];

  const questionnaires: Questionnaire[] = [
    {
      id: '1',
      title: 'Customer Satisfaction Survey',
      description: 'Survey to measure customer satisfaction with our services',
      questions: [],
      createdAt: '2024-01-01T00:00:00Z',
      isActive: true,
      assignedTo: [],
    },
    {
      id: '2',
      title: 'Product Feedback Form',
      description: 'Collecting feedback on our latest product features',
      questions: [],
      createdAt: '2024-01-05T00:00:00Z',
      isActive: true,
      assignedTo: [],
    },
    {
      id: '3',
      title: 'Service Quality Assessment',
      description: 'Assessment of service quality and delivery',
      questions: [],
      createdAt: '2024-01-10T00:00:00Z',
      isActive: true,
      assignedTo: [],
    },
  ];

  const progressData = [
    { month: 'Jan', completed: 12, incomplete: 3 },
    { month: 'Feb', completed: 15, incomplete: 2 },
    { month: 'Mar', completed: 18, incomplete: 1 },
    { month: 'Apr', completed: 22, incomplete: 0 },
    { month: 'May', completed: 25, incomplete: 2 },
  ];

  const completionTrendData = [
    { week: 'Week 1', rate: 85 },
    { week: 'Week 2', rate: 88 },
    { week: 'Week 3', rate: 92 },
    { week: 'Week 4', rate: 95 },
    { week: 'Week 5', rate: 93 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'incomplete': return 'warning';
      case 'draft': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'incomplete': return <Warning />;
      case 'draft': return <Schedule />;
      default: return <Error />;
    }
  };

  const getQuestionnaireTitle = (questionnaireId: string) => {
    const questionnaire = questionnaires.find(q => q.id === questionnaireId);
    return questionnaire?.title || 'Unknown Questionnaire';
  };

  const handleViewResponse = (response: InterviewResponse) => {
    setSelectedResponse(response);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedResponse(null);
  };

  const completedCount = userResponses.filter(r => r.status === 'completed').length;
  const incompleteCount = userResponses.filter(r => r.status === 'incomplete').length;
  const draftCount = userResponses.filter(r => r.status === 'draft').length;
  const totalCount = userResponses.length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Progress
      </Typography>

      <Grid container spacing={3}>
        {/* Progress Overview Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Forms
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {totalCount}
                  </Typography>
                </Box>
                <Assignment sx={{ color: 'primary.main', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Completed
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {completedCount}
                  </Typography>
                </Box>
                <CheckCircle sx={{ color: 'success.main', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Incomplete
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    {incompleteCount}
                  </Typography>
                </Box>
                <Warning sx={{ color: 'warning.main', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Drafts
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                    {draftCount}
                  </Typography>
                </Box>
                <Schedule sx={{ color: 'info.main', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Charts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Progress
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#4caf50" />
                  <Bar dataKey="incomplete" fill="#ff9800" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Completion Rate Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={completionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="#1976d2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Progress Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Form Completion Details
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Form Title</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Completion</TableCell>
                      <TableCell>Last Modified</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userResponses.map((response) => (
                      <TableRow key={response.id}>
                        <TableCell component="th" scope="row">
                          {getQuestionnaireTitle(response.questionnaireId)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(response.status)}
                            label={response.status}
                            color={getStatusColor(response.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={response.completionPercentage}
                                color={response.completionPercentage === 100 ? 'success' : 'warning'}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {response.completionPercentage}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {new Date(response.lastModified).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => handleViewResponse(response)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Response View */}
        {userResponses.map((response) => (
          <Grid item xs={12} key={response.id}>
            <Accordion>
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
                    {getQuestionnaireTitle(response.questionnaireId)}
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
                  {response.responses.length > 0 ? (
                    <List>
                      {response.responses.map((resp, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircle color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`Question ${index + 1}`}
                            secondary={Array.isArray(resp.answer) ? resp.answer.join(', ') : resp.answer}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No responses yet
                    </Typography>
                  )}
                  
                  <Typography variant="caption" color="text.secondary">
                    Last modified: {new Date(response.lastModified).toLocaleString()}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>

      {/* Response Detail Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Response Details - {selectedResponse && getQuestionnaireTitle(selectedResponse.questionnaireId)}
        </DialogTitle>
        <DialogContent>
          {selectedResponse && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Status: {selectedResponse.status}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Completion: {selectedResponse.completionPercentage}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={selectedResponse.completionPercentage}
                  color={selectedResponse.completionPercentage === 100 ? 'success' : 'warning'}
                  sx={{ mb: 2 }}
                />
              </Box>
              
              <Typography variant="h6" gutterBottom>
                Responses:
              </Typography>
              {selectedResponse.responses.map((resp, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Question {index + 1}:
                  </Typography>
                  <Typography variant="body1">
                    {Array.isArray(resp.answer) ? resp.answer.join(', ') : resp.answer}
                  </Typography>
                </Box>
              ))}
              
              <Typography variant="caption" color="text.secondary">
                Last modified: {new Date(selectedResponse.lastModified).toLocaleString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyProgress;
