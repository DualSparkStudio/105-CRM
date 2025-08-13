import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Collapse,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import {
  Search,
  FilterList,
  ExpandMore,
  Visibility,
  Download,
  Refresh,
  Assessment,
} from '@mui/icons-material';
import { format } from 'date-fns';

// Mock data - replace with actual API calls
const mockResponses: InterviewResponse[] = [
  {
    id: '1',
    questionnaireId: 'q1',
    userId: 'user1',
    responses: [
      { questionId: 'q1_1', answer: 'John Doe' },
      { questionId: 'q1_2', answer: 'john.doe@example.com' },
      { questionId: 'q1_3', answer: '+1234567890' },
      { questionId: 'q1_4', answer: 'Software Engineer' },
      { questionId: 'q1_5', answer: 'React, TypeScript, Node.js' },
    ],
    status: 'completed',
    submittedAt: '2024-01-15T10:30:00Z',
    lastModified: '2024-01-15T10:30:00Z',
    completionPercentage: 100,
  },
  {
    id: '2',
    questionnaireId: 'q1',
    userId: 'user2',
    responses: [
      { questionId: 'q1_1', answer: 'Jane Smith' },
      { questionId: 'q1_2', answer: 'jane.smith@example.com' },
      { questionId: 'q1_3', answer: '+1987654321' },
      { questionId: 'q1_4', answer: 'Product Manager' },
      { questionId: 'q1_5', answer: 'Product Strategy, Agile, UX' },
    ],
    status: 'completed',
    submittedAt: '2024-01-14T14:20:00Z',
    lastModified: '2024-01-14T14:20:00Z',
    completionPercentage: 100,
  },
  {
    id: '3',
    questionnaireId: 'q2',
    userId: 'user3',
    responses: [
      { questionId: 'q2_1', answer: 'Mike Johnson' },
      { questionId: 'q2_2', answer: 'mike.johnson@example.com' },
      { questionId: 'q2_3', answer: '+1555666777' },
    ],
    status: 'incomplete',
    lastModified: '2024-01-13T09:15:00Z',
    completionPercentage: 60,
  },
];

const mockQuestionnaires: Questionnaire[] = [
  {
    id: 'q1',
    title: 'Technical Skills Assessment',
    description: 'Assessment for technical roles',
    questions: [
      { id: 'q1_1', text: 'Full Name', type: 'text', required: true, order: 1 },
      { id: 'q1_2', text: 'Email Address', type: 'email', required: true, order: 2 },
      { id: 'q1_3', text: 'Phone Number', type: 'phone', required: true, order: 3 },
      { id: 'q1_4', text: 'Current Role', type: 'text', required: true, order: 4 },
      { id: 'q1_5', text: 'Technical Skills', type: 'text', required: true, order: 5 },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true,
    assignedTo: ['user1', 'user2'],
  },
  {
    id: 'q2',
    title: 'General Information Form',
    description: 'Basic information collection',
    questions: [
      { id: 'q2_1', text: 'Full Name', type: 'text', required: true, order: 1 },
      { id: 'q2_2', text: 'Email Address', type: 'email', required: true, order: 2 },
      { id: 'q2_3', text: 'Phone Number', type: 'phone', required: true, order: 3 },
      { id: 'q2_4', text: 'Department', type: 'select', required: true, options: ['IT', 'HR', 'Marketing', 'Sales'], order: 4 },
      { id: 'q2_5', text: 'Experience Level', type: 'radio', required: true, options: ['Junior', 'Mid-level', 'Senior'], order: 5 },
    ],
    createdAt: '2024-01-05T00:00:00Z',
    isActive: true,
    assignedTo: ['user3'],
  },
];

const mockUsers: User[] = [
  { id: 'user1', username: 'john_doe', email: 'john.doe@example.com', role: 'user', createdAt: '2024-01-01T00:00:00Z', isActive: true, interviewCount: 5, completedForms: 4, incompleteForms: 1 },
  { id: 'user2', username: 'jane_smith', email: 'jane.smith@example.com', role: 'user', createdAt: '2024-01-02T00:00:00Z', isActive: true, interviewCount: 3, completedForms: 3, incompleteForms: 0 },
  { id: 'user3', username: 'mike_johnson', email: 'mike.johnson@example.com', role: 'user', createdAt: '2024-01-03T00:00:00Z', isActive: true, interviewCount: 2, completedForms: 1, incompleteForms: 1 },
];

interface ResponsesViewProps {}

const ResponsesView: React.FC<ResponsesViewProps> = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [questionnaireFilter, setQuestionnaireFilter] = useState<string>('all');
  const [selectedResponse, setSelectedResponse] = useState<InterviewResponse | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const filteredResponses = useMemo(() => {
    return mockResponses.filter((response) => {
      const matchesSearch = searchTerm === '' || 
        mockUsers.find(u => u.id === response.userId)?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mockUsers.find(u => u.id === response.userId)?.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || response.status === statusFilter;
      const matchesQuestionnaire = questionnaireFilter === 'all' || response.questionnaireId === questionnaireFilter;

      return matchesSearch && matchesStatus && matchesQuestionnaire;
    });
  }, [searchTerm, statusFilter, questionnaireFilter]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (response: InterviewResponse) => {
    setSelectedResponse(response);
    setDetailDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'incomplete':
        return 'warning';
      case 'draft':
        return 'default';
      default:
        return 'default';
    }
  };

  const getUserName = (userId: string) => {
    return mockUsers.find(u => u.id === userId)?.username || 'Unknown User';
  };

  const getUserEmail = (userId: string) => {
    return mockUsers.find(u => u.id === userId)?.email || 'No email';
  };

  const getQuestionnaireTitle = (questionnaireId: string) => {
    return mockQuestionnaires.find(q => q.id === questionnaireId)?.title || 'Unknown Questionnaire';
  };

  const getQuestionText = (questionnaireId: string, questionId: string) => {
    const questionnaire = mockQuestionnaires.find(q => q.id === questionnaireId);
    return questionnaire?.questions.find(question => question.id === questionId)?.text || 'Unknown Question';
  };

  const exportToCSV = () => {
    const headers = ['User', 'Email', 'Questionnaire', 'Status', 'Completion %', 'Submitted Date'];
    const csvContent = [
      headers.join(','),
      ...filteredResponses.map(response => [
        getUserName(response.userId),
        getUserEmail(response.userId),
        getQuestionnaireTitle(response.questionnaireId),
        response.status,
        `${response.completionPercentage}%`,
        response.submittedAt ? format(new Date(response.submittedAt), 'yyyy-MM-dd HH:mm') : 'Not submitted'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questionnaire_responses_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
          <Assessment sx={{ mr: 2 }} />
          Questionnaire Responses
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={exportToCSV}
            sx={{ mr: 1 }}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setQuestionnaireFilter('all');
            }}
          >
            Reset Filters
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search by user"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="incomplete">Incomplete</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Questionnaire</InputLabel>
              <Select
                value={questionnaireFilter}
                label="Questionnaire"
                onChange={(e) => setQuestionnaireFilter(e.target.value)}
              >
                <MenuItem value="all">All Questionnaires</MenuItem>
                {mockQuestionnaires.map((questionnaire) => (
                  <MenuItem key={questionnaire.id} value={questionnaire.id}>
                    {questionnaire.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary">
              {filteredResponses.length} responses
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Responses Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Questionnaire</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Completion</TableCell>
                <TableCell>Submitted Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredResponses
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((response) => (
                  <TableRow key={response.id} hover>
                    <TableCell>{getUserName(response.userId)}</TableCell>
                    <TableCell>{getUserEmail(response.userId)}</TableCell>
                    <TableCell>{getQuestionnaireTitle(response.questionnaireId)}</TableCell>
                    <TableCell>
                      <Chip
                        label={response.status}
                        color={getStatusColor(response.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <Box
                            sx={{
                              width: '100%',
                              height: 8,
                              bgcolor: 'grey.200',
                              borderRadius: 1,
                              overflow: 'hidden',
                            }}
                          >
                            <Box
                              sx={{
                                width: `${response.completionPercentage}%`,
                                height: '100%',
                                bgcolor: response.completionPercentage === 100 ? 'success.main' : 'warning.main',
                              }}
                            />
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {response.completionPercentage}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {response.submittedAt
                        ? format(new Date(response.submittedAt), 'MMM dd, yyyy HH:mm')
                        : 'Not submitted'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(response)}
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredResponses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Response Details
          {selectedResponse && (
            <Typography variant="subtitle2" color="text.secondary">
              {getUserName(selectedResponse.userId)} - {getQuestionnaireTitle(selectedResponse.questionnaireId)}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedResponse && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">User</Typography>
                  <Typography variant="body1">{getUserName(selectedResponse.userId)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{getUserEmail(selectedResponse.userId)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip
                    label={selectedResponse.status}
                    color={getStatusColor(selectedResponse.status) as any}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Completion</Typography>
                  <Typography variant="body1">{selectedResponse.completionPercentage}%</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Submitted</Typography>
                  <Typography variant="body1">
                    {selectedResponse.submittedAt
                      ? format(new Date(selectedResponse.submittedAt), 'MMM dd, yyyy HH:mm')
                      : 'Not submitted'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Last Modified</Typography>
                  <Typography variant="body1">
                    {format(new Date(selectedResponse.lastModified), 'MMM dd, yyyy HH:mm')}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ mb: 2 }}>Responses</Typography>
              {selectedResponse.responses.map((response, index) => (
                <Accordion key={index} defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1">
                      {getQuestionText(selectedResponse.questionnaireId, response.questionId)}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1">
                      {Array.isArray(response.answer) ? response.answer.join(', ') : response.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResponsesView;
