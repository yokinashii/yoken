# Ketuś - Strategic Keto Analytics Platform

## Project Overview

**Ketuś** is an intelligent support ecosystem for people on a ketogenic diet and biohackers. Unlike standard calorie counters, Ketuś focuses on biochemistry, long-term trends, and well-being. The character of Ketuś (an avocado mascot) acts as a mentor who analyzes data rather than just collecting it.

**Project Name**: Copy of Ketuś - Twój Strategiczny Analityk Keto
**Description**: Expert in keto and biohacking that monitors your progress scientifically and flexibly, focusing on long-term biochemical trends.

**AI Studio Link**: https://ai.studio/apps/drive/1uOAeoZT7h1Zt9-BPqNm2QDITH0ofjcH5

## Core Purpose

This application serves as a personalized keto mentor that:
- **Analyzes, not just collects**: Ketuś interprets data and provides strategic insights
- Evaluates meal choices for nutritional density and ketosis impact
- Tracks key biometric metrics (weight, energy/well-being, sleep quality)
- Provides evidence-based advice grounded in physiology (insulin, dopamine, cortisol, ketone bodies, mineral balance)
- Focuses on long-term weekly trends over short-term daily fluctuations
- Offers a friendly, buddy-like approach to biochemical optimization
- Understands hormonal mechanisms and explains biological processes

## Tech Stack

### Frontend
- **React 19.2.3** - UI framework
- **TypeScript 5.8.2** - Type safety
- **Vite 6.2.0** - Build tool and dev server
- **Lucide React 0.562.0** - Icon library
- **Recharts 3.6.0** - Data visualization for metrics

### Backend Services
- **Google Gemini AI** (@google/genai 1.35.0) - AI chat assistant (gemini-3-flash-preview model)
- **Supabase** (@supabase/supabase-js 2.48.1) - Authentication and database (PostgreSQL with RLS)

### Architecture
- **Single-page application** with import maps (does not require complex build-step in sandbox environments)
- **Component-based** architecture with React
- **Function calling** integration with Gemini AI

### Design System
- Dark theme with purple accent colors (#0f041a background)
- Glassmorphism UI design pattern
- Responsive layout (mobile-first, desktop-optimized)
- Custom gradient effects and animations

## Architecture

### Project Structure
```
yoken/
├── components/
│   ├── Auth.tsx           # Authentication UI (login/signup)
│   ├── ChatWindow.tsx     # AI chat interface
│   └── Dashboard.tsx      # Analytics and charts
├── services/
│   ├── geminiService.ts   # AI integration with function calling
│   └── supabaseService.ts # Database and auth operations
├── App.tsx                # Main application component
├── index.tsx              # Application entry point
├── types.ts               # TypeScript type definitions
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

### Data Models

#### MetricLog
```typescript
{
  id: string;
  date: string;
  weight: number;
  wellBeing: number;      // Scale 1-10
  sleepQuality: number;   // Scale 1-10
  progressNote: string;
}
```

#### Message
```typescript
{
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
```

## Key Features

### 1. AI-Powered Chat Assistant (Ketuś)
- **Model**: Google Gemini 3 Flash Preview
- **Personality**: Strategic, buddy-like, evidence-based keto expert
- **Philosophy**:
  - Long-term trends over short-term fluctuations
  - Substance over detail
  - Evidence-based advice grounded in physiology
  - No judgment on "bad days" - explains biological mechanisms instead

### 2. Function Calling Integration
The AI uses Google's function calling feature to intelligently log metrics:
- **Function**: `logMetrics`
- **Trigger**: Only when user provides weight, well-being, or sleep data
- **Storage**: Automatically saves to Supabase database
- **Smart**: Doesn't spam requests for meal details

### 3. User Authentication
- Email/password authentication via Supabase
- User profiles with first name, last name
- Premium status indicator (Crown icon for `is_premium` users)
- Secure session management

### 4. Health Metrics Dashboard
- **Weight Tracking**: Shows current weight with trend indicators
  - Area chart visualization for weight trends over time
- **Energy/Well-being**: Tracks energy levels (1-10 scale)
  - Line chart for well-being progression
- **Sleep Quality**: Monitors sleep quality (1-10 scale)
- **Visual Analytics**: Responsive biometric charts using Recharts
  - Area charts for weight data
  - Line charts for well-being and sleep metrics
  - Automatic scaling and responsive design
- **Historical Logs**: Table view of all past entries with date, weight, and progress notes

### 5. Data Persistence
- **Backend**: Supabase PostgreSQL database
- **Real-time**: Automatic synchronization
- **User-scoped**: Each user's data is isolated
- **Status Indicator**: "Dane zsynchronizowane z chmurą Supabase" message

## AI System Instruction (Ketuś Personality)

The AI assistant follows these core principles:

1. **Long-term Focus**: Analyzes weekly trends, not daily variations
2. **Meal Analysis**: Evaluates food for nutritional density and ketosis impact
3. **Selective Logging**: Only logs key success metrics (weight, well-being, sleep)
4. **Flexibility**: Doesn't judge "bad days" - explains biological mechanisms
5. **Evidence-Based**: All advice grounded in insulin, ketone bodies, and mineral balance
6. **Real Food Focus**: Promotes nutrient-dense whole foods over keto marketing products

## Environment Configuration

### Required Environment Variables
- `GEMINI_API_KEY` - Google Gemini API key (set in `.env.local`)
- Supabase configuration (URL and anon key) - set in `supabaseService.ts`

### Local Development
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## UI Components

### App.tsx
**Main state controller** - Orchestrates the entire application:
- Manages Supabase session and authentication state
- Handles data synchronization between UI and database
- Controls layout (Dashboard + Chat grid)
- Coordinates chat message flow and AI responses
- Implements `onLogMetrics` callback for function calling integration

### ChatWindow.tsx
**Conversational interface** - Handles user interaction with Ketuś:
- Message history display with role-based styling (user vs assistant)
- Loading states with Ketuś Thinking animation
- "Thinking" state indicator when AI is processing
- Input field with send functionality
- Auto-scroll to latest message

### Dashboard.tsx
**Data visualization component** - Presents biometric data:
- Processes `keto_logs` data for chart rendering
- Area charts for weight trends (using Recharts)
- Line charts for well-being and sleep quality
- Responsive chart sizing and scaling
- Handles empty state when no data exists

### Auth.tsx
**Authentication UI** - Complete login/registration system:
- Toggle between sign-up and sign-in modes
- Email/password authentication via Supabase
- Captures first name and last name during registration
- Stores user metadata in profiles table via trigger
- Error handling and loading states

### Layout Structure

#### Header
- Ketuś logo with fallback to Bot icon
- User name display with premium badge (Crown icon)
- Logout and settings buttons
- Glassmorphic fixed header

#### Main Dashboard (Left Column - 8/12 cols)
- Three metric cards: Weight, Energy, Sleep
- Interactive charts and visualizations
- Historical logs table with date, weight, and status notes

#### Chat Window (Right Column - 4/12 cols)
- Sticky sidebar on desktop
- Message history with user/assistant roles
- Loading states with Ketuś Thinking mascot
- Input field for user messages

### Visual Design Elements
- **Image Fallbacks**: All images have icon fallbacks (using lucide-react)
- **Animations**: Bounce, pulse, scale, and hover effects
- **Glassmorphism**: Semi-transparent backgrounds with blur
- **Color Palette**: Purple primary, blue/teal accents on dark base

## Database Schema (Supabase)

The project relies on two main tables and a trigger mechanism:

### Tables

#### `profiles`
Extension of the `auth.users` table:
- **Fields**:
  - `id` (UUID, primary key, references auth.users)
  - `first_name` (text)
  - `last_name` (text)
  - `email` (text)
  - `is_premium` (boolean, default false)
- **Trigger**: `on_auth_user_created` automatically creates a profile upon user registration

#### `keto_logs`
Stores biometric measurements:
- **Fields**:
  - `id` (UUID, primary key)
  - `user_id` (UUID, foreign key to auth.users)
  - `date` (date)
  - `weight` (numeric)
  - `well_being` (integer, 1-10 scale)
  - `sleep_quality` (integer, 1-10 scale)
  - `progress_note` (text)
- **Security**: Protected by Row Level Security (RLS)
  - Users can only see their own data: `auth.uid() = user_id`
  - SELECT, INSERT, UPDATE policies enforce user isolation

## Key Technical Decisions

1. **Why Gemini over OpenAI**: Function calling for structured metric logging
2. **Why Supabase**: Integrated auth + database with real-time capabilities
3. **Why Vite**: Fast development experience and modern build tooling
4. **Why React 19**: Latest features and performance improvements
5. **Design Philosophy**: Glassmorphism fits the premium, scientific aesthetic

## Development Notes

### Image Assets (Ketuś Mascot)
The Ketuś character (avocado mascot) is crucial for UX. Each expression serves a specific purpose:

- `input_file_0.png` - **Ketuś Confident** - Used for weight/profile icon, represents determination
- `input_file_1.png` - **Ketuś Joyful/Ecstatic** - Used in greetings and celebrating successes
- `input_file_2.png` - **Ketuś Waving** - Main logo, welcoming gesture
- `input_file_3.png` - **Ketuś Smiling** - Used for sleep/regeneration icon, represents rest
- `input_file_4.png` - **Ketuś Thinking/Analytical** - Displayed when AI answer is loading, shows analysis in progress

All images have fallback to lucide-react icons in case of loading errors.

### Polish Language
The entire UI is in Polish:
- "Waga" (Weight)
- "Energia" (Energy)
- "Sen" (Sleep)
- "Zaloguj się" (Log in)
- etc.

### Responsive Design
- Mobile-first approach
- Grid layout: 1 column on mobile, 12-column grid on desktop
- Dashboard: 8 columns, Chat: 4 columns on large screens
- Sticky chat sidebar on desktop

## Future Development Roadmap

### Planned Features

#### 1. Premium System
- The `profiles` table already has an `is_premium` column ready for implementation
- **Proposed**: Lock advanced trend analysis features for non-premium users
- **Ideas**:
  - Extended historical data access (free: 30 days, premium: unlimited)
  - Advanced biochemical insights and correlations
  - Export data to CSV/PDF
  - Personalized meal plans based on biometric trends

#### 2. Meal Analysis with Camera
- **Current Capability**: Gemini AI excels at recognizing food from photos
- **Implementation**: Add camera permission to `metadata.json` (already has microphone)
- **Feature**: Allow Ketuś to analyze the user's plate visually
  - Estimate macronutrients from photo
  - Evaluate ketogenic compatibility
  - Provide instant feedback on meal choices
  - Build meal history database for pattern recognition

#### 3. Grounding & Data Sources
- Future integration with external data sources for evidence-based recommendations
- Link scientific studies to specific advice given by Ketuś

### Development Guidelines

When working on this project, keep in mind:
1. **Personality Consistency**: The AI should maintain its strategic, long-term focus personality
2. **Data Integrity**: Metrics should only be logged when users explicitly provide them
3. **Design System**: The glassmorphic design aesthetic should be preserved
4. **Privacy First**: All user data is private and scoped to authenticated users (RLS enforced)
5. **Trend Focus**: The app emphasizes trends over individual data points
6. **Language**: Polish language should be maintained throughout the UI
7. **Mascot Usage**: Use appropriate Ketuś expressions for different contexts
8. **Biochemistry Focus**: Always ground advice in hormonal and metabolic mechanisms

## Git History

- Initial commit: Basic project setup
- Latest: "feat: Initialize project with basic structure and dependencies"
- Branch: `main`
- Status: Clean working directory
