# Ketuś - Strategic Keto Analytics Platform

## Project Overview

**Ketuś** is a web-based strategic keto diet and biohacking analysis application. It combines AI-powered nutritional advice with personal health tracking to help users optimize their ketogenic journey through long-term trend analysis rather than daily fluctuations.

**Project Name**: Copy of Ketuś - Twój Strategiczny Analityk Keto
**Description**: Expert in keto and biohacking that monitors your progress scientifically and flexibly, focusing on long-term biochemical trends.

**AI Studio Link**: https://ai.studio/apps/drive/1uOAeoZT7h1Zt9-BPqNm2QDITH0ofjcH5

## Core Purpose

This application serves as a personalized keto coach that:
- Analyzes meal choices for nutritional density and ketosis impact
- Tracks key health metrics (weight, energy/well-being, sleep quality)
- Provides evidence-based advice grounded in physiology (insulin, ketone bodies, mineral balance)
- Focuses on long-term weekly trends over short-term daily variations
- Offers a friendly, no-nonsense approach to biochemical optimization

## Tech Stack

### Frontend
- **React 19.2.3** - UI framework
- **TypeScript 5.8.2** - Type safety
- **Vite 6.2.0** - Build tool and dev server
- **Lucide React 0.562.0** - Icon library
- **Recharts 3.6.0** - Data visualization for metrics

### Backend Services
- **Google Gemini AI** (@google/genai 1.35.0) - AI chat assistant (gemini-3-flash-preview model)
- **Supabase** (@supabase/supabase-js 2.48.1) - Authentication and database

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
- **Energy/Well-being**: Tracks energy levels (1-10 scale)
- **Sleep Quality**: Monitors sleep quality (1-10 scale)
- **Visual Analytics**: Charts and graphs using Recharts
- **Historical Logs**: Table view of all past entries

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

### Header
- Ketuś logo with fallback
- User name display with premium badge
- Logout and settings buttons
- Glassmorphic fixed header

### Main Dashboard (Left Column)
- Three metric cards: Weight, Energy, Sleep
- Interactive charts and visualizations
- Historical logs table with date, weight, and status notes

### Chat Window (Right Column)
- Sticky sidebar on desktop
- Message history with user/assistant roles
- Loading states with animations
- Input field for user messages

### Visual Design Elements
- **Image Fallbacks**: All images have icon fallbacks (using lucide-react)
- **Animations**: Bounce, pulse, scale, and hover effects
- **Glassmorphism**: Semi-transparent backgrounds with blur
- **Color Palette**: Purple primary, blue/teal accents on dark base

## Database Schema (Supabase)

Expected tables:
- `logs` - User metric entries
  - Columns: id, date, weight, well_being, sleep_quality, progress_note, user_id
- `profiles` - User profile data
  - Columns: first_name, last_name, is_premium

## Key Technical Decisions

1. **Why Gemini over OpenAI**: Function calling for structured metric logging
2. **Why Supabase**: Integrated auth + database with real-time capabilities
3. **Why Vite**: Fast development experience and modern build tooling
4. **Why React 19**: Latest features and performance improvements
5. **Design Philosophy**: Glassmorphism fits the premium, scientific aesthetic

## Development Notes

### Image Assets
The app references several image files:
- `input_file_0.png` - Weight/scale icon
- `input_file_1.png` - Energy/heart icon
- `input_file_2.png` - Ketuś logo/avatar
- `input_file_3.png` - Sleep/moon icon

All images have fallback to lucide-react icons.

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

## Future Considerations

When working on this project, keep in mind:
1. The AI should maintain its strategic, long-term focus personality
2. Metrics should only be logged when users explicitly provide them
3. The glassmorphic design aesthetic should be preserved
4. All user data is private and scoped to authenticated users
5. The app emphasizes trends over individual data points
6. Polish language should be maintained throughout

## Git History

- Initial commit: Basic project setup
- Latest: "feat: Initialize project with basic structure and dependencies"
- Branch: `main`
- Status: Clean working directory
