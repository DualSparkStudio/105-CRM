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
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Search,
  ExpandMore,
  Visibility,
  Download,
  Refresh,
  Assessment,
  Edit,
  Delete,
  Add,
  QuestionAnswer,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { InterviewResponse, Questionnaire, User } from '../../types';
import { responseService, questionnaireService, userService } from '../../services/api';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingResponse, setEditingResponse] = useState<InterviewResponse | null>(null);
  const [debugInfo, setDebugInfo] = useState<{
    connectionStatus: string;
    envVars: { url: boolean; key: boolean };
    dataCounts: { responses: number; questionnaires: number; users: number };
    lastError?: string;
  }>({
    connectionStatus: 'Checking...',
    envVars: { url: false, key: false },
    dataCounts: { responses: 0, questionnaires: 0, users: 0 }
  });

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('=== DEBUGGING SUPABASE CONNECTION ===');
        
        // Check environment variables
        console.log('Environment variables:');
        console.log('REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL ? 'SET' : 'NOT SET');
        console.log('REACT_APP_SUPABASE_ANON_KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
        
        setDebugInfo(prev => ({
          ...prev,
          envVars: {
            url: !!process.env.REACT_APP_SUPABASE_URL,
            key: !!process.env.REACT_APP_SUPABASE_ANON_KEY
          }
        }));
        
        // Test Supabase connection
        console.log('Testing Supabase connection...');
        const { data: testData, error: testError } = await supabase
          .from('users')
          .select('count')
          .limit(1);
        
        if (testError) {
          console.error('Supabase connection test failed:', testError);
          setDebugInfo(prev => ({
            ...prev,
            connectionStatus: `Failed: ${testError.message}`,
            lastError: testError.message
          }));
          toast.error(`Connection failed: ${testError.message}`);
          return;
        }
        
        console.log('Supabase connection successful!');
        console.log('Test query result:', testData);
        setDebugInfo(prev => ({
          ...prev,
          connectionStatus: 'Connected'
        }));
        
        // Load actual data
        console.log('Loading responses...');
        const responsesData = await responseService.getResponses();
        console.log('Responses loaded:', responsesData.length, responsesData);
        
        console.log('Loading questionnaires...');
        const questionnairesData = await questionnaireService.getQuestionnaires();
        console.log('Questionnaires loaded:', questionnairesData.length, questionnairesData);
        
        console.log('Loading users...');
        const usersData = await userService.getUsers();
        console.log('Users loaded:', usersData.length, usersData);
        
        console.log('=== DATA SUMMARY ===');
        console.log('Total responses:', responsesData.length);
        console.log('Total questionnaires:', questionnairesData.length);
        console.log('Total users:', usersData.length);
        
        setResponses(responsesData);
        setQuestionnaires(questionnairesData);
        setUsers(usersData);
        
        setDebugInfo(prev => ({
          ...prev,
          dataCounts: {
            responses: responsesData.length,
            questionnaires: questionnairesData.length,
            users: usersData.length
          }
        }));
        
        if (responsesData.length === 0) {
          console.log('⚠️ No responses found - this might indicate:');
          console.log('1. Database is empty (run sample-data.sql)');
          console.log('2. RLS policies are blocking access');
          console.log('3. User is not authenticated');
          console.log('4. Wrong database schema');
        }
        
      } catch (error) {
        console.error('=== ERROR DETAILS ===');
        console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
        console.error('Error message:', error instanceof Error ? error.message : String(error));
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        console.error('Full error object:', error);
        
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        setDebugInfo(prev => ({
          ...prev,
          connectionStatus: 'Error',
          lastError: errorMessage
        }));
        
        toast.error(`Failed to load data: ${errorMessage}`);
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

  const handleEditResponse = (response: InterviewResponse) => {
    setEditingResponse(response);
    setEditDialogOpen(true);
  };

  const handleDeleteResponse = (response: InterviewResponse) => {
    setSelectedResponse(response);
    setDeleteDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingResponse) return;
    
    try {
      await responseService.updateResponse(editingResponse.id, editingResponse);
      toast.success('Response updated successfully');
      setEditDialogOpen(false);
      setEditingResponse(null);
      // Reload data
      const [responsesData, questionnairesData, usersData] = await Promise.all([
        responseService.getResponses(),
        questionnaireService.getQuestionnaires(),
        userService.getUsers(),
      ]);
      setResponses(responsesData);
      setQuestionnaires(questionnairesData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error updating response:', error);
      toast.error('Failed to update response');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedResponse) return;
    
    try {
      await responseService.deleteResponse(selectedResponse.id);
      toast.success('Response deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedResponse(null);
      // Reload data
      const [responsesData, questionnairesData, usersData] = await Promise.all([
        responseService.getResponses(),
        questionnaireService.getQuestionnaires(),
        userService.getUsers(),
      ]);
      setResponses(responsesData);
      setQuestionnaires(questionnairesData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error deleting response:', error);
      toast.error('Failed to delete response');
    }
  };

  const handleUpdateAnswer = (questionId: string, answer: string) => {
    if (!editingResponse) return;
    
    const updatedResponses = editingResponse.responses.map(response => 
      response.questionId === questionId 
        ? { ...response, answer }
        : response
    );
    
    setEditingResponse({
      ...editingResponse,
      responses: updatedResponses,
      completionPercentage: Math.round((updatedResponses.length / 10) * 100) // Simplified calculation
    });
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
          <QuestionAnswer sx={{ mr: 2 }} />
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

      {/* Debug Panel */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>🔧 Debug Information</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2">Connection Status:</Typography>
            <Chip 
              label={debugInfo.connectionStatus} 
              color={debugInfo.connectionStatus === 'Connected' ? 'success' : 'error'}
              size="small"
            />
          </Box>
          <Box>
            <Typography variant="subtitle2">Environment Variables:</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                label={`URL: ${debugInfo.envVars.url ? '✅' : '❌'}`} 
                color={debugInfo.envVars.url ? 'success' : 'error'}
                size="small"
              />
              <Chip 
                label={`KEY: ${debugInfo.envVars.key ? '✅' : '❌'}`} 
                color={debugInfo.envVars.key ? 'success' : 'error'}
                size="small"
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle2">Data Counts:</Typography>
            <Typography variant="body2">
              Responses: {debugInfo.dataCounts.responses} | 
              Questionnaires: {debugInfo.dataCounts.questionnaires} | 
              Users: {debugInfo.dataCounts.users}
            </Typography>
          </Box>
        </Box>
        {debugInfo.lastError && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" color="error">Last Error:</Typography>
            <Typography variant="body2" color="error">{debugInfo.lastError}</Typography>
          </Box>
        )}
      </Alert>

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
                        title="View Details"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEditResponse(response)}
                        color="secondary"
                        title="Edit Response"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteResponse(response)}
                        color="error"
                        title="Delete Response"
                      >
                        <Delete />
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

      {/* Edit Response Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Response
          {editingResponse && (
            <Typography variant="subtitle2" color="text.secondary">
              {getUserName(editingResponse.userId)} - {getQuestionnaireTitle(editingResponse.questionnaireId)}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {editingResponse && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">User</Typography>
                  <Typography variant="body1">{getUserName(editingResponse.userId)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Questionnaire</Typography>
                  <Typography variant="body1">{getQuestionnaireTitle(editingResponse.questionnaireId)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={editingResponse.status}
                      label="Status"
                      onChange={(e) => setEditingResponse({
                        ...editingResponse,
                        status: e.target.value as 'completed' | 'incomplete' | 'draft'
                      })}
                    >
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="incomplete">Incomplete</MenuItem>
                      <MenuItem value="draft">Draft</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Completion</Typography>
                  <Typography variant="body1">{editingResponse.completionPercentage}%</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ mb: 2 }}>Edit Answers</Typography>
              {editingResponse.responses.map((response, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Question {index + 1}
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={response.answer}
                    onChange={(e) => handleUpdateAnswer(response.questionId, e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this response?
          </Typography>
          {selectedResponse && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              User: {getUserName(selectedResponse.userId)}<br />
              Questionnaire: {getQuestionnaireTitle(selectedResponse.questionnaireId)}<br />
              Status: {selectedResponse.status}
            </Typography>
          )}
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResponsesView;
