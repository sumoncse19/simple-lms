# Learning Management System (LMS)

A modern Learning Management System built with React, TypeScript, and Vite, featuring a clean UI using Shadcn UI components.
Live URL: [LMS System](https://simple-lms-eta.vercel.app/)

## Project Structure

```
src/
├── components/
│   ├── ui/           # Shadcn UI components
│   └── Layout.tsx    # Main layout component with navigation
├── pages/
│   ├── CourseCatalog.tsx    # Course listing with search and filters
│   ├── CourseDetails.tsx    # Individual course view
│   ├── MyLearning.tsx       # Enrolled courses and progress
│   ├── LearningHistory.tsx  # Completed courses history
│   └── Profile.tsx          # User profile management
├── services/
│   └── storage.ts    # LocalStorage management
├── types/
│   └── index.ts      # TypeScript type definitions
└── lib/
    └── utils.ts      # Utility functions
```

## Key Features

### 1. Course Management

- Browse courses with search and filters
- View detailed course information
- Enroll in courses with prerequisite checking
- Track course progress
- View learning history

### 2. State Management

- React's built-in state management using `useState` and `useEffect`
- Local component state for UI interactions
- Centralized data management through storage service

### 3. Data Persistence

- LocalStorage-based data management
- Sample data initialization
- CRUD operations for courses, enrollments, and user profiles

### 4. UI Components

- Modern UI using Shadcn UI components
- Responsive design
- Loading states and error handling
- Accessible components

## Component Details

### CourseCatalog

- Search functionality with debouncing
- Category and price filters
- Sorting options
- Pagination
- Responsive grid layout

### CourseDetails

- Course information display
- Prerequisite checking
- Enrollment management
- Progress tracking

### MyLearning

- Enrolled courses list
- Progress tracking with slider
- Course status management
- Continue learning functionality

### LearningHistory

- Completed courses table
- Learning statistics
- Course review access
- Summary of total learning hours

### Profile

- User information management
- Email validation
- Category preferences
- Notification settings

## Data Structure

### Course

```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  isFree: boolean;
  level: string;
  instructor: string;
  prerequisites?: string[];
}
```

### Enrollment

```typescript
interface Enrollment {
  courseId: string;
  status: "enrolled" | "completed";
  progress: number;
  enrolledAt: string;
  completedAt?: string;
}
```

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  preferredCategories: string[];
  notificationPreference: boolean;
}
```

## LocalStorage Usage

The application uses localStorage with the key `lms_data` to store:

- Course catalog
- User enrollments
- User profiles
- Course progress

Data is initialized with sample courses if none exists.

## Getting Started

1. Install dependencies:

```bash
npm install
```

or,

```bash
pnpm install
```

2. Start the development server:

```bash
npm run dev
```

or,

```bash
pnpm dev
```

3. Build for production:

```bash
npm run build
```

or,

```bash
pnpm build
```

## Technologies Used

- React
- TypeScript
- Vite
- Shadcn UI
- React Router
- LocalStorage API
