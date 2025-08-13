# CRM System - Dynamic Questionnaire Management

A comprehensive Customer Relationship Management (CRM) system with dynamic questionnaire management, user performance tracking, and interview analytics.

## Features

### Admin Features
1. **User Management**
   - Create and manage user accounts with roles (admin/user)
   - View user statistics and performance metrics
   - Enable/disable user accounts

2. **Dynamic Questionnaire Management**
   - Create custom questionnaires with various question types
   - Support for text, number, email, phone, date, select, radio, and checkbox questions
   - Assign questionnaires to specific users
   - Activate/deactivate questionnaires

3. **Interview Analytics**
   - Comprehensive dashboard with user performance metrics
   - Real-time statistics and charts
   - Detailed response analysis
   - Filter and search capabilities

4. **Threshold Management**
   - Set minimum interview requirements for users
   - Configure warning thresholds
   - Monitor users below threshold
   - Performance categorization (Excellent, Good, Average, Critical)

5. **Data Segregation**
   - Categorize users based on work completion
   - Track completion rates and progress
   - Highlight underperforming users

### User Features
1. **Interview Forms**
   - Access assigned questionnaires
   - Fill out forms with various question types
   - Save drafts and continue later
   - Edit completed forms

2. **Progress Tracking**
   - View personal statistics and completion rates
   - Track progress towards goals
   - Monitor form completion status
   - View detailed response history

3. **Form Management**
   - Start new interviews
   - Continue incomplete forms
   - Review and edit completed forms
   - Save work in progress

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **State Management**: React Context API
- **Form Handling**: Formik with Yup validation
- **Charts**: Recharts
- **Routing**: React Router v6
- **Notifications**: React Hot Toast
- **Data Fetching**: React Query

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crm-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Demo Credentials

### Admin Access
- **Username**: `admin`
- **Password**: `admin`

### User Access
- **Username**: `user`
- **Password**: `user`

## Project Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminOverview.tsx
│   │   ├── UserManagement.tsx
│   │   ├── QuestionnaireManagement.tsx
│   │   ├── InterviewAnalytics.tsx
│   │   └── ThresholdSettings.tsx
│   ├── user/
│   │   ├── UserDashboard.tsx
│   │   ├── UserOverview.tsx
│   │   ├── InterviewForms.tsx
│   │   └── MyProgress.tsx
│   └── auth/
│       ├── Login.tsx
│       └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx
├── types/
│   └── index.ts
├── App.tsx
└── index.tsx
```

## Key Components

### Admin Components
- **AdminDashboard**: Main admin interface with navigation
- **AdminOverview**: Dashboard with statistics and charts
- **UserManagement**: Create, edit, and manage users
- **QuestionnaireManagement**: Create and manage dynamic questionnaires
- **InterviewAnalytics**: Detailed analytics and reporting
- **ThresholdSettings**: Configure performance thresholds

### User Components
- **UserDashboard**: Main user interface with navigation
- **UserOverview**: Personal dashboard with progress tracking
- **InterviewForms**: Fill out assigned questionnaires
- **MyProgress**: Track form completion and progress

## Security Features

- **Role-based Access Control**: Admin and user roles with protected routes
- **Form Validation**: Client-side validation using Yup schemas
- **Authentication**: JWT-based authentication (mock implementation)
- **Data Protection**: Secure handling of user data and responses

## Performance Features

- **Lightweight Design**: Optimized for fast loading and smooth interactions
- **Responsive UI**: Works on desktop, tablet, and mobile devices
- **Efficient State Management**: Minimal re-renders with React Context
- **Lazy Loading**: Components loaded on demand

## Data Management

The current implementation uses mock data for demonstration purposes. In a production environment, you would need to:

1. **Backend API**: Implement RESTful APIs for data operations
2. **Database**: Set up a database (PostgreSQL, MongoDB, etc.)
3. **Authentication**: Implement proper JWT authentication
4. **Data Validation**: Add server-side validation
5. **Error Handling**: Implement comprehensive error handling

## Customization

### Adding New Question Types
1. Update the `Question` type in `src/types/index.ts`
2. Add the question type to the `questionTypes` array in `QuestionnaireManagement.tsx`
3. Implement the rendering logic in the `renderQuestion` function in `InterviewForms.tsx`

### Modifying Thresholds
1. Update the threshold configuration in `ThresholdSettings.tsx`
2. Modify the performance categorization logic
3. Update the dashboard displays accordingly

### Styling
The application uses Material-UI theming. You can customize the theme in `App.tsx` by modifying the `createTheme` configuration.

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live data updates
2. **Advanced Analytics**: More sophisticated reporting and analytics
3. **Export Features**: PDF/Excel export of reports and responses
4. **Notification System**: Email/SMS notifications for users
5. **Mobile App**: React Native mobile application
6. **API Integration**: Third-party integrations (CRM systems, email services)
7. **Multi-language Support**: Internationalization (i18n)
8. **Advanced Security**: Two-factor authentication, audit logs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
