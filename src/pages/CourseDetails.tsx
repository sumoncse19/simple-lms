import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getCourse,
  getEnrollment,
  enrollInCourse,
  getEnrollments,
} from "@/services/storage";
import type { Course, Enrollment } from "@/types";
import { cn } from "@/lib/utils";

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCourseData = () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!courseId) {
          throw new Error("Course ID is required");
        }

        const courseData = getCourse(courseId);
        if (!courseData) {
          throw new Error("Course not found");
        }

        const enrollmentData = getEnrollment(courseId);

        setCourse(courseData);
        setEnrollment(enrollmentData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load course");
        console.error("Error loading course:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseData();
  }, [courseId]);

  const handleEnroll = () => {
    try {
      if (!courseId) {
        throw new Error("Course ID is required");
      }

      // Check if already enrolled
      if (enrollment) {
        throw new Error("You are already enrolled in this course");
      }

      // Check prerequisites
      const allEnrollments = getEnrollments();
      const hasPrerequisites = course?.prerequisites?.every(
        (prereqId: string) => {
          const prereqEnrollment = allEnrollments.find(
            (e) => e.courseId === prereqId
          );
          return prereqEnrollment?.status === "completed";
        }
      );

      if (course?.prerequisites?.length && !hasPrerequisites) {
        throw new Error("You must complete all prerequisite courses first");
      }

      // Enroll in the course
      enrollInCourse(courseId);
      const newEnrollment = getEnrollment(courseId);
      setEnrollment(newEnrollment);

      // Navigate to the course content
      navigate(`/learning/${courseId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to enroll in course"
      );
      console.error("Error enrolling in course:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert>
          <AlertDescription>Course not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p
          className={cn(
            course.isFree ? "bg-green-600" : "bg-red-600",
            "text-sm font-medium px-2 py-1 rounded-md text-white"
          )}
        >
          {course.isFree ? "Free" : "Paid"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
          <CardDescription>{course.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Details</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Category: {course.category}</li>
                <li>Duration: {course.duration} hours</li>
                <li>Level: {course.level}</li>
                <li>Instructor: {course.instructor}</li>
              </ul>
            </div>
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Prerequisites</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {course.prerequisites.map((prereqId: string) => {
                    const prereqCourse = getCourse(prereqId);
                    return (
                      <li key={prereqId}>
                        {prereqCourse?.title || "Unknown Course"}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {enrollment ? (
            <div className="flex gap-2">
              {enrollment.status === "completed" ? (
                <>
                  <Button className="w-full" disabled>
                    Completed
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/learning/${course.id}`)}
                  >
                    Check Full Progress
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => navigate(`/learning/${course.id}`)}
                >
                  Continue Learning
                </Button>
              )}
            </div>
          ) : (
            <Button className="w-full" onClick={handleEnroll}>
              Enroll Now
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default CourseDetails;
