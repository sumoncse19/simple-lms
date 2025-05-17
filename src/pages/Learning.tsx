import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  getCourse,
  getEnrollment,
  updateEnrollmentProgress,
} from "@/services/storage";
import type { Course, Enrollment } from "@/types";

const Learning = () => {
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
        if (!enrollmentData) {
          throw new Error("You are not enrolled in this course");
        }

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

  const handleProgressUpdate = (progress: number) => {
    try {
      if (!courseId) {
        throw new Error("Course ID is required");
      }

      updateEnrollmentProgress(courseId, progress);
      const updatedEnrollment = getEnrollment(courseId);
      setEnrollment(updatedEnrollment);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update progress"
      );
      console.error("Error updating progress:", err);
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

  if (!course || !enrollment) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert>
          <AlertDescription>
            Course not found or you are not enrolled
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <Button variant="outline" onClick={() => navigate("/courses")}>
          Back to Courses
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Progress</CardTitle>
          <CardDescription>
            {enrollment.status === "completed"
              ? "Congratulations! You have completed this course."
              : "Continue learning to complete the course."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{enrollment.progress}%</span>
            </div>
            <Progress value={enrollment.progress} />
          </div>

          <div className="grid gap-4">
            <Button
              onClick={() =>
                handleProgressUpdate(Math.min(enrollment.progress + 10, 100))
              }
              disabled={enrollment.status === "completed"}
            >
              Mark Section Complete (+10%)
            </Button>
            {enrollment.progress > 0 && (
              <Button
                variant="outline"
                onClick={() =>
                  handleProgressUpdate(Math.max(enrollment.progress - 10, 0))
                }
                disabled={enrollment.status === "completed"}
              >
                Undo Last Section (-10%)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Content</CardTitle>
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
      </Card>
    </div>
  );
};

export default Learning;
