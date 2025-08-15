# CRM System with Dynamic Questionnaires

A comprehensive CRM system built with React, TypeScript, and Supabase, featuring dynamic questionnaires, user management, and analytics.

## Features

- **User Management**: Admin and user roles with different permissions
- **Dynamic Questionnaires**: Create and manage questionnaires with various question types
- **Response Tracking**: View and analyze questionnaire responses
- **Analytics Dashboard**: Comprehensive analytics and reporting
- **Real-time Data**: Powered by Supabase for real-time database operations
- **Responsive Design**: Modern UI built with Material-UI
- **Export Functionality**: Export responses to CSV format

## Tech Stack

- **Frontend**: React 18, TypeScript, Material-UI
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React Query for server state
- **Routing**: React Router v6
- **Forms**: Formik with Yup validation
- **Charts**: Recharts for data visualization
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd 105-CRM
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env` file in the root directory:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Execute the SQL to create all tables, indexes, and policies

### 5. Configure Authentication

1. In Supabase dashboard, go to Authentication > Settings
2. Configure your site URL (e.g., `http://localhost:3000` for development)
3. Add redirect URLs for your domain

### 6. Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Database Schema

### Tables

- **users**: User accounts and profiles
- **questionnaires**: Questionnaire definitions
- **questions**: Individual questions within questionnaires
- **interview_responses**: User responses to questionnaires
- **response_answers**: Individual answers to questions
- **threshold_config**: Configuration for completion thresholds

### Key Features

- **Row Level Security (RLS)**: Secure data access based on user roles
- **Automatic Triggers**: User stats and completion percentages are calculated automatically
- **UUID Primary Keys**: Secure and scalable ID system
- **Comprehensive Indexing**: Optimized for performance

## Deployment

### Netlify Deployment

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

### Environment Variables

Make sure to set these environment variables in your deployment platform:

- `REACT_APP_SUPABASE_URL`: Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Usage

### Admin Features

1. **Dashboard**: Overview of system statistics
2. **User Management**: Create, edit, and manage user accounts
3. **Questionnaire Management**: Create and configure questionnaires
4. **Responses View**: View and analyze all questionnaire responses
5. **Analytics**: Detailed analytics and reporting
6. **Threshold Settings**: Configure completion thresholds

### User Features

1. **Dashboard**: Personal overview and progress
2. **Questionnaires**: Complete assigned questionnaires
3. **Progress Tracking**: View completion status and history

## API Services

The application uses the following service modules:

- `userService`: User management operations
- `questionnaireService`: Questionnaire CRUD operations
- `questionService`: Question management
- `responseService`: Response handling and analysis
- `statsService`: Dashboard statistics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
