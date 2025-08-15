import React, { useState, useMemo, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import {
  Search,
  ExpandMore,
  Visibility,
  Download,
  Refresh,
  Assessment,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { InterviewResponse, Questionnaire, User } from '../../types';
import { responseService, questionnaireService, userService } from '../../services/api';
import toast from 'react-hot-toast';

interface ResponsesViewProps {}

const ResponsesView: React.FC<ResponsesViewProps> = () => {
  const [responses, setResponses] = useState<InterviewResponse[]>([]);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [questionnaireFilter, setQuestionnaireFilter] = useState<string>('all');
  const [selectedResponse, setSelectedResponse] = useState<InterviewResponse | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [responsesData, questionnairesData, usersData] = await Promise.all([
          responseService.getResponses(),
          questionnaireService.getQuestionnaires(),
          userService.getUsers(),
        ]);
        
        setResponses(responsesData);
        setQuestionnaires(questionnairesData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredResponses = useMemo(() => {
    return responses.filter((response) => {
      const user = users.find(u => u.id === response.userId);
      const matchesSearch = searchTerm === '' || 
        user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || response.status === statusFilter;
      const matchesQuestionnaire = questionnaireFilter === 'all' || response.questionnaireId === questionnaireFilter;

      return matchesSearch && matchesStatus && matchesQuestionnaire;
    });
  }, [responses, users, searchTerm, statusFilter, questionnaireFilter]);

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
    return users.find(u => u.id === userId)?.username || 'Unknown User';
  };

  const getUserEmail = (userId: string) => {
    return users.find(u => u.id === userId)?.email || 'No email';
  };

  const getQuestionnaireTitle = (questionnaireId: string) => {
    return questionnaires.find(q => q.id === questionnaireId)?.title || 'Unknown Questionnaire';
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
                {questionnaires.map((questionnaire) => (
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
                      Question {index + 1}
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
