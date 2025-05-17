export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  isFree: boolean;
  level: 'beginner' | 'intermediate' | 'advanced';
  instructor: string;
  imageUrl?: string;
  prerequisites?: string[];
}

export interface Enrollment {
  userId: string;
  courseId: string;
  status: 'enrolled' | 'completed';
  progress: number;
  enrolledAt: string;
  completedAt?: string;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    preferredCategories: string[];
    notifications: boolean;
  };
}

export interface LocalStorageData {
  courses: Course[];
  enrollments: Enrollment[];
  user: User;
} 