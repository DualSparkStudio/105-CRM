import {
    Assignment,
    CheckCircle,
    Edit,
    PlayArrow,
    Save,
    Send
} from '@mui/icons-material';
import {
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
    Grid,
    InputLabel,
    LinearProgress,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { InterviewResponse, Question, Questionnaire } from '../../types';

const InterviewForms: React.FC = () => {
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<Questionnaire | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: any }>({});

  // Mock data - replace with actual API calls
  const questionnaires: Questionnaire[] = [
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
        {
          id: '3',
          text: 'Which features do you use most frequently?',
          type: 'checkbox',
          required: true,
          options: ['Feature A', 'Feature B', 'Feature C', 'Feature D'],
          order: 3,
        },
        {
          id: '4',
          text: 'Rate the overall product experience',
          type: 'select',
          required: true,
          options: ['Excellent', 'Good', 'Average', 'Poor'],
          order: 4,
        },
      ],
      createdAt: '2024-01-01T00:00:00Z',
      isActive: true,
      assignedTo: ['1'],
    },
    {
      id: '2',
      title: 'Product Feedback Form',
      description: 'Collecting feedback on our latest product features',
      questions: [
        {
          id: '5',
          text: 'How likely are you to recommend our product?',
          type: 'radio',
          required: true,
          options: ['Very Likely', 'Likely', 'Neutral', 'Unlikely', 'Very Unlikely'],
          order: 1,
        },
        {
          id: '6',
          text: 'What is your primary use case for our product?',
          type: 'text',
          required: true,
          order: 2,
        },
      ],
      createdAt: '2024-01-05T00:00:00Z',
      isActive: true,
      assignedTo: ['1'],
    },
  ];

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
  ];

  const handleStartForm = (questionnaire: Questionnaire) => {
    setSelectedQuestionnaire(questionnaire);
    setCurrentStep(0);
    setResponses({});
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedQuestionnaire(null);
    setCurrentStep(0);
    setResponses({});
  };

  const handleNext = () => {
    if (currentStep < (selectedQuestionnaire?.questions.length || 0) - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    // Save current progress
    toast.success('Draft saved successfully!');
  };

  const handleSubmitForm = () => {
    // Submit the completed form
    toast.success('Form submitted successfully!');
    handleCloseForm();
  };

  const getResponseStatus = (questionnaireId: string) => {
    const response = userResponses.find(r => r.questionnaireId === questionnaireId);
    if (!response) return { status: 'not_started', label: 'Not Started', color: 'default' };
    
    switch (response.status) {
      case 'completed':
        return { status: 'completed', label: 'Completed', color: 'success' };
      case 'incomplete':
        return { status: 'incomplete', label: 'Incomplete', color: 'warning' };
      case 'draft':
        return { status: 'draft', label: 'Draft', color: 'info' };
      default:
        return { status: 'not_started', label: 'Not Started', color: 'default' };
    }
  };

  const renderQuestion = (question: Question) => {
    const currentResponse = responses[question.id];

    switch (question.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your answer"
            value={currentResponse || ''}
            onChange={(e) => setResponses({ ...responses, [question.id]: e.target.value })}
            required={question.required}
          />
        );

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label="Your answer"
            value={currentResponse || ''}
            onChange={(e) => setResponses({ ...responses, [question.id]: e.target.value })}
            required={question.required}
          />
        );

      case 'email':
        return (
          <TextField
            fullWidth
            type="email"
            label="Your email"
            value={currentResponse || ''}
            onChange={(e) => setResponses({ ...responses, [question.id]: e.target.value })}
            required={question.required}
          />
        );

      case 'phone':
        return (
          <TextField
            fullWidth
            type="tel"
            label="Your phone number"
            value={currentResponse || ''}
            onChange={(e) => setResponses({ ...responses, [question.id]: e.target.value })}
            required={question.required}
          />
        );

      case 'date':
        return (
          <TextField
            fullWidth
            type="date"
            label="Select date"
            value={currentResponse || ''}
            onChange={(e) => setResponses({ ...responses, [question.id]: e.target.value })}
            required={question.required}
            InputLabelProps={{ shrink: true }}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth required={question.required}>
            <InputLabel>Select an option</InputLabel>
            <Select
              value={currentResponse || ''}
              onChange={(e) => setResponses({ ...responses, [question.id]: e.target.value })}
            >
              {question.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl component="fieldset" required={question.required}>
            <RadioGroup
              value={currentResponse || ''}
              onChange={(e) => setResponses({ ...responses, [question.id]: e.target.value })}
            >
              {question.options?.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl component="fieldset" required={question.required}>
            <FormGroup>
              {question.options?.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={Array.isArray(currentResponse) ? currentResponse.includes(option) : false}
                      onChange={(e) => {
                        const currentArray = Array.isArray(currentResponse) ? currentResponse : [];
                        const newArray = e.target.checked
                          ? [...currentArray, option]
                          : currentArray.filter(item => item !== option);
                        setResponses({ ...responses, [question.id]: newArray });
                      }}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
          </FormControl>
        );

      default:
        return <Typography color="error">Unsupported question type</Typography>;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Interview Forms
      </Typography>

      <Grid container spacing={3}>
        {questionnaires.map((questionnaire) => {
          const status = getResponseStatus(questionnaire.id);
          return (
            <Grid item xs={12} md={6} key={questionnaire.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {questionnaire.title}
                    </Typography>
                    <Chip
                      label={status.label}
                      color={status.color as any}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {questionnaire.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Assignment sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">
                      {questionnaire.questions.length} questions
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {status.status === 'not_started' && (
                      <Button
                        variant="contained"
                        startIcon={<PlayArrow />}
                        onClick={() => handleStartForm(questionnaire)}
                        fullWidth
                      >
                        Start Form
                      </Button>
                    )}
                    
                    {status.status === 'incomplete' && (
                      <>
                        <Button
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={() => handleStartForm(questionnaire)}
                          sx={{ flex: 1 }}
                        >
                          Continue
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<CheckCircle />}
                          onClick={() => handleStartForm(questionnaire)}
                          sx={{ flex: 1 }}
                        >
                          Complete
                        </Button>
                      </>
                    )}
                    
                    {status.status === 'completed' && (
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => handleStartForm(questionnaire)}
                        fullWidth
                      >
                        Review & Edit
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Form Dialog */}
      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { height: '90vh' } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {selectedQuestionnaire?.title}
            </Typography>
            <Chip
              label={`Question ${currentStep + 1} of ${selectedQuestionnaire?.questions.length}`}
              color="primary"
              size="small"
            />
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {selectedQuestionnaire && (
            <Box>
              {/* Progress Bar */}
              <LinearProgress
                variant="determinate"
                value={((currentStep + 1) / selectedQuestionnaire.questions.length) * 100}
                sx={{ mb: 3 }}
              />

              {/* Stepper */}
              <Stepper activeStep={currentStep} sx={{ mb: 3 }}>
                {selectedQuestionnaire.questions.map((_, index) => (
                  <Step key={index}>
                    <StepLabel>Q{index + 1}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Current Question */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedQuestionnaire.questions[currentStep].text}
                  {selectedQuestionnaire.questions[currentStep].required && (
                    <span style={{ color: 'red' }}> *</span>
                  )}
                </Typography>
                
                {renderQuestion(selectedQuestionnaire.questions[currentStep])}
              </Paper>

              {/* Navigation */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  Back
                </Button>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Save />}
                    onClick={handleSaveDraft}
                  >
                    Save Draft
                  </Button>
                  
                  {currentStep === selectedQuestionnaire.questions.length - 1 ? (
                    <Button
                      variant="contained"
                      startIcon={<Send />}
                      onClick={handleSubmitForm}
                    >
                      Submit Form
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InterviewForms;
