import type { Course, Enrollment, User, LocalStorageData } from "@/types";

const STORAGE_KEY = "lms_data";

const SAMPLE_COURSES: Course[] = [
  {
    id: "1",
    title: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript",
    category: "Programming",
    duration: 8,
    isFree: true,
    level: "beginner",
    instructor: "John Doe",
    prerequisites: [],
  },
  {
    id: "2",
    title: "Advanced React Patterns",
    description: "Master advanced React concepts and patterns",
    category: "Programming",
    duration: 12,
    isFree: false,
    level: "advanced",
    instructor: "Jane Smith",
    prerequisites: ["1"],
  },
  {
    id: "3",
    title: "Figma for Designers",
    description: "Master Figma to design responsive and interactive interfaces",
    category: "Design",
    duration: 11,
    isFree: false,
    level: "intermediate",
    instructor: "Daniel Lee",
    prerequisites: [],
  },
  {
    id: "4",
    title: "Machine Learning Fundamentals",
    description: "Introduction to machine learning algorithms",
    category: "Programming",
    duration: 15,
    isFree: false,
    level: "intermediate",
    instructor: "Sarah Wilson",
    prerequisites: ["1"],
  },
  {
    id: "5",
    title: "Mobile App Development with Flutter",
    description: "Build cross-platform mobile apps with Flutter",
    category: "Programming",
    duration: 14,
    isFree: true,
    level: "beginner",
    instructor: "Alex Brown",
    prerequisites: ["1"],
  },
  {
    id: "6",
    title: "UI/UX Design Principles",
    description:
      "Learn essential design principles to create user-friendly interfaces",
    category: "Design",
    duration: 9,
    isFree: true,
    level: "beginner",
    instructor: "Emily Carter",
    prerequisites: ["3"],
  },
  {
    id: "7",
    title: "Python for Data Science",
    description: "Learn Python programming for data analysis",
    category: "Programming",
    duration: 10,
    isFree: true,
    level: "intermediate",
    instructor: "Mike Johnson",
    prerequisites: ["1", "4"],
  },
  {
    id: "8",
    title: "Typography and Color Theory in Design",
    description: "Explore how typography and color influence user experience",
    category: "Design",
    duration: 7,
    isFree: true,
    level: "intermediate",
    instructor: "Laura Kim",
    prerequisites: ["3", "6"],
  },
];

const DEFAULT_USER: User = {
  userId: "current-user",
  name: "Demo User",
  email: "demo@example.com",
  preferences: {
    preferredCategories: ["Programming", "Design"],
    notifications: false,
  },
};

const getInitialData = (): LocalStorageData => ({
  courses: SAMPLE_COURSES,
  enrollments: [],
  user: DEFAULT_USER,
});

const validateData = (data: unknown): data is LocalStorageData => {
  if (!data || typeof data !== "object") return false;

  const d = data as LocalStorageData;
  return (
    Array.isArray(d.courses) &&
    Array.isArray(d.enrollments) &&
    typeof d.user === "object" &&
    d.user !== null &&
    typeof d.user.userId === "string" &&
    typeof d.user.name === "string" &&
    typeof d.user.email === "string" &&
    typeof d.user.preferences === "object" &&
    d.user.preferences !== null &&
    Array.isArray(d.user.preferences.preferredCategories) &&
    typeof d.user.preferences.notifications === "boolean" &&
    d.courses.every(
      (course) =>
        typeof course.id === "string" &&
        typeof course.title === "string" &&
        typeof course.description === "string" &&
        typeof course.category === "string" &&
        typeof course.duration === "number" &&
        typeof course.isFree === "boolean" &&
        ["beginner", "intermediate", "advanced"].includes(course.level) &&
        typeof course.instructor === "string"
    ) &&
    d.enrollments.every(
      (enrollment) =>
        typeof enrollment.userId === "string" &&
        typeof enrollment.courseId === "string" &&
        ["enrolled", "completed"].includes(enrollment.status) &&
        typeof enrollment.progress === "number" &&
        enrollment.progress >= 0 &&
        enrollment.progress <= 100 &&
        typeof enrollment.enrolledAt === "string" &&
        (!enrollment.completedAt || typeof enrollment.completedAt === "string")
    )
  );
};

const getData = (): LocalStorageData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const initialData = getInitialData();
      saveData(initialData);
      return initialData;
    }

    const parsedData = JSON.parse(data);
    if (!validateData(parsedData)) {
      console.error("Invalid data structure in localStorage");
      const initialData = getInitialData();
      saveData(initialData);
      return initialData;
    }

    return parsedData;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    const initialData = getInitialData();
    saveData(initialData);
    return initialData;
  }
};

const saveData = (data: LocalStorageData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    throw new Error("Failed to save data to localStorage");
  }
};

export const getCourses = (page = 1, pageSize = 10): Course[] => {
  const allCourses = getData().courses;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return allCourses.slice(start, end);
};

export const getTotalCourses = (): number => {
  return getData().courses.length;
};

export const getCourse = (courseId: string): Course | null => {
  try {
    return getData().courses.find((course) => course.id === courseId) || null;
  } catch (error) {
    console.error("Error retrieving course:", error);
    return null;
  }
};

export const getEnrollments = (): Enrollment[] => {
  try {
    return getData().enrollments;
  } catch (error) {
    console.error("Error retrieving enrollments:", error);
    return [];
  }
};

export const getEnrollment = (courseId: string): Enrollment | null => {
  try {
    const userId = "current-user";
    return (
      getEnrollments().find(
        (enrollment) =>
          enrollment.courseId === courseId && enrollment.userId === userId
      ) || null
    );
  } catch (error) {
    console.error("Error retrieving enrollment:", error);
    return null;
  }
};

export const enrollInCourse = (courseId: string): void => {
  try {
    const data = getData();
    const userId = "current-user";

    const existingEnrollment = data.enrollments.find(
      (e) => e.courseId === courseId && e.userId === userId
    );

    if (!existingEnrollment) {
      const newEnrollment: Enrollment = {
        userId,
        courseId,
        status: "enrolled",
        progress: 0,
        enrolledAt: new Date().toISOString(),
      };
      data.enrollments.push(newEnrollment);
      saveData(data);
    }
  } catch (error) {
    console.error("Error enrolling in course:", error);
    throw new Error("Failed to enroll in course");
  }
};

export const updateEnrollmentProgress = (
  courseId: string,
  progress: number
): void => {
  try {
    const data = getData();
    const userId = "current-user";

    const enrollment = data.enrollments.find(
      (e) => e.courseId === courseId && e.userId === userId
    );

    if (enrollment) {
      enrollment.progress = Math.min(Math.max(progress, 0), 100);
      if (enrollment.progress === 100) {
        enrollment.status = "completed";
        enrollment.completedAt = new Date().toISOString();
      }
      saveData(data);
    }
  } catch (error) {
    console.error("Error updating enrollment progress:", error);
    throw new Error("Failed to update enrollment progress");
  }
};

export const getCurrentUser = (): User | null => {
  try {
    return getData().user;
  } catch (error) {
    console.error("Error retrieving current user:", error);
    return null;
  }
};

export const updateUserProfile = (updates: Partial<User>): void => {
  try {
    const data = getData();
    data.user = { ...data.user, ...updates };
    saveData(data);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
};

export const updateUserPreferences = (
  preferences: User["preferences"]
): void => {
  try {
    const data = getData();
    data.user.preferences = { ...data.user.preferences, ...preferences };
    saveData(data);
  } catch (error) {
    console.error("Error updating user preferences:", error);
    throw new Error("Failed to update user preferences");
  }
};
