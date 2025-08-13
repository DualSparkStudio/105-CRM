import {
    Add,
    Delete,
    DragIndicator,
    Edit,
    ExpandMore,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
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
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { Question, Questionnaire, User } from '../../types';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
});

const questionTypes = [
  { value: 'text', label: 'Text Input' },
  { value: 'number', label: 'Number Input' },
  { value: 'email', label: 'Email Input' },
  { value: 'phone', label: 'Phone Input' },
  { value: 'date', label: 'Date Input' },
  { value: 'select', label: 'Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkboxes' },
];

const QuestionnaireManagement: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingQuestionnaire, setEditingQuestionnaire] = useState<Questionnaire | null>(null);
  const [questions, setQuestions] = useState<Omit<Question, 'id'>[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Mock data - replace with actual API calls
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([
    {
      id: '1',
      title: 'Customer Satisfaction Survey',
      description: 'Survey to measure customer satisfaction with our services',
      questions: [
        {
          id: '1',
          text: 'How satisfied are you with our service?',
          type: 'radio',
          required: true,
          options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
          order: 1,
        },
        {
          id: '2',
          text: 'What aspects of our service could be improved?',
          type: 'text',
          required: false,
          order: 2,
        },
      ],
      createdAt: '2024-01-01T00:00:00Z',
      isActive: true,
      assignedTo: ['1', '2'],
    },
    {
      id: '2',
      title: 'Product Feedback Form',
      description: 'Collecting feedback on our latest product features',
      questions: [
        {
          id: '3',
          text: 'Which features do you use most frequently?',
          type: 'checkbox',
          required: true,
          options: ['Feature A', 'Feature B', 'Feature C', 'Feature D'],
          order: 1,
        },
        {
          id: '4',
          text: 'Rate the overall product experience',
          type: 'select',
          required: true,
          options: ['Excellent', 'Good', 'Average', 'Poor'],
          order: 2,
        },
      ],
      createdAt: '2024-01-05T00:00:00Z',
      isActive: false,
      assignedTo: ['1', '3'],
    },
  ]);

  const mockUsers: User[] = [
    { id: '1', username: 'john_doe', email: 'john@example.com', role: 'user', createdAt: '', isActive: true, interviewCount: 0, completedForms: 0, incompleteForms: 0 },
    { id: '2', username: 'jane_smith', email: 'jane@example.com', role: 'user', createdAt: '', isActive: true, interviewCount: 0, completedForms: 0, incompleteForms: 0 },
    { id: '3', username: 'mike_johnson', email: 'mike@example.com', role: 'user', createdAt: '', isActive: true, interviewCount: 0, completedForms: 0, incompleteForms: 0 },
  ];

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (editingQuestionnaire) {
        // Update existing questionnaire
        const updatedQuestions = questions.map((q, index) => ({ ...q, id: (index + 1).toString() }));
        setQuestionnaires(questionnaires.map(q => 
          q.id === editingQuestionnaire.id 
            ? { ...q, title: values.title, description: values.description, questions: updatedQuestions, assignedTo: selectedUsers }
            : q
        ));
        toast.success('Questionnaire updated successfully!');
      } else {
        // Create new questionnaire
        const newQuestionnaire: Questionnaire = {
          id: Date.now().toString(),
          title: values.title,
          description: values.description,
          questions: questions.map((q, index) => ({ ...q, id: (index + 1).toString() })),
          createdAt: new Date().toISOString(),
          isActive: true,
          assignedTo: selectedUsers,
        };
        setQuestionnaires([...questionnaires, newQuestionnaire]);
        toast.success('Questionnaire created successfully!');
      }
      handleCloseDialog();
    },
  });

  const handleOpenDialog = (questionnaire?: Questionnaire) => {
    if (questionnaire) {
      setEditingQuestionnaire(questionnaire);
      setQuestions(questionnaire.questions.map(q => ({ text: q.text, type: q.type, required: q.required, options: q.options, order: q.order })));
      setSelectedUsers(questionnaire.assignedTo);
      formik.setValues({
        title: questionnaire.title,
        description: questionnaire.description,
      });
    } else {
      setEditingQuestionnaire(null);
      setQuestions([]);
      setSelectedUsers([]);
      formik.resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingQuestionnaire(null);
    setQuestions([]);
    setSelectedUsers([]);
    formik.resetForm();
  };

  const addQuestion = () => {
    const newQuestion: Omit<Question, 'id'> = {
      text: '',
      type: 'text',
      required: false,
      order: questions.length + 1,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const toggleQuestionnaireStatus = (questionnaireId: string) => {
    setQuestionnaires(questionnaires.map(q =>
      q.id === questionnaireId ? { ...q, isActive: !q.isActive } : q
    ));
    toast.success('Questionnaire status updated!');
  };

  const deleteQuestionnaire = (questionnaireId: string) => {
    if (window.confirm('Are you sure you want to delete this questionnaire?')) {
      setQuestionnaires(questionnaires.filter(q => q.id !== questionnaireId));
      toast.success('Questionnaire deleted successfully!');
    }
  };

  const handleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Questionnaire Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Create Questionnaire
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Questions</TableCell>
                  <TableCell>Assigned Users</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questionnaires.map((questionnaire) => (
                  <TableRow key={questionnaire.id}>
                    <TableCell component="th" scope="row">
                      {questionnaire.title}
                    </TableCell>
                    <TableCell>{questionnaire.description}</TableCell>
                    <TableCell>{questionnaire.questions.length} questions</TableCell>
                    <TableCell>{questionnaire.assignedTo.length} users</TableCell>
                    <TableCell>
                      <Chip
                        label={questionnaire.isActive ? 'Active' : 'Inactive'}
                        color={questionnaire.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(questionnaire.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(questionnaire)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => toggleQuestionnaireStatus(questionnaire.id)}
                        color={questionnaire.isActive ? 'warning' : 'success'}
                      >
                        {questionnaire.isActive ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => deleteQuestionnaire(questionnaire.id)}
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

      {/* Create/Edit Questionnaire Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingQuestionnaire ? 'Edit Questionnaire' : 'Create New Questionnaire'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Questionnaire Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              margin="normal"
            />
            
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              margin="normal"
            />

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Questions
            </Typography>
            
            {questions.map((question, index) => (
              <Accordion key={index} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <DragIndicator sx={{ mr: 1 }} />
                  <Typography>Question {index + 1}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Question Text"
                      value={question.text}
                      onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                    />
                    
                    <FormControl fullWidth>
                      <InputLabel>Question Type</InputLabel>
                      <Select
                        value={question.type}
                        onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                      >
                        {questionTypes.map(type => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {(question.type === 'select' || question.type === 'radio' || question.type === 'checkbox') && (
                      <TextField
                        fullWidth
                        label="Options (comma-separated)"
                        value={question.options?.join(', ') || ''}
                        onChange={(e) => updateQuestion(index, 'options', e.target.value.split(',').map(s => s.trim()))}
                        helperText="Enter options separated by commas"
                      />
                    )}

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={question.required}
                          onChange={(e) => updateQuestion(index, 'required', e.target.checked)}
                        />
                      }
                      label="Required question"
                    />

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeQuestion(index)}
                      startIcon={<Delete />}
                    >
                      Remove Question
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}

            <Button
              variant="outlined"
              onClick={addQuestion}
              startIcon={<Add />}
              sx={{ mt: 2 }}
            >
              Add Question
            </Button>

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Assign to Users
            </Typography>
            
            <FormGroup>
              {mockUsers.map(user => (
                <FormControlLabel
                  key={user.id}
                  control={
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelection(user.id)}
                    />
                  }
                  label={`${user.username} (${user.email})`}
                />
              ))}
            </FormGroup>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={() => formik.handleSubmit()}
            variant="contained"
            disabled={formik.isSubmitting || questions.length === 0}
          >
            {editingQuestionnaire ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionnaireManagement;
