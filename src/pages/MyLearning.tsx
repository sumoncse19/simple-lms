import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import type { Course, Enrollment } from "@/types";
import {
  getEnrollments,
  getCourse,
  updateEnrollmentProgress,
} from "@/services/storage";

const MyLearning = () => {
  const [enrollments, setEnrollments] = useState<
    Array<Enrollment & { course: Course }>
  >([]);

  useEffect(() => {
    const loadEnrollments = () => {
      const userEnrollments = getEnrollments();
      const enrollmentsWithCourses = userEnrollments
        .map((enrollment) => {
          const course = getCourse(enrollment.courseId);
          if (!course) return null;
          return { ...enrollment, course };
        })
        .filter(
          (item): item is Enrollment & { course: Course } => item !== null
        );
      setEnrollments(enrollmentsWithCourses);
    };

    loadEnrollments();
  }, []);

  const handleProgressChange = (courseId: string, progress: number) => {
    updateEnrollmentProgress(courseId, progress);
    const userEnrollments = getEnrollments();
    const updatedEnrollment = userEnrollments.find(
      (e) => e.courseId === courseId
    );
    if (updatedEnrollment) {
      setEnrollments((prev) =>
        prev.map((e) =>
          e.courseId === courseId
            ? {
                ...e,
                progress: updatedEnrollment.progress,
                status: updatedEnrollment.status,
                completedAt: updatedEnrollment.completedAt,
              }
            : e
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Learning</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {enrollments.map((enrollment) => (
          <Card key={enrollment.courseId} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{enrollment.course.title}</CardTitle>
                <Badge
                  variant={
                    enrollment.status === "completed" ? "default" : "secondary"
                  }
                >
                  {enrollment.status === "completed"
                    ? "Completed"
                    : "In Progress"}
                </Badge>
              </div>
              <CardDescription>{enrollment.course.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Duration: {enrollment.course.duration} hours
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Level: {enrollment.course.level}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{enrollment.progress}%</span>
                  </div>
                  <Slider
                    value={[enrollment.progress]}
                    onValueChange={([value]) =>
                      handleProgressChange(enrollment.courseId, value)
                    }
                    max={100}
                    step={1}
                    disabled={enrollment.status === "completed"}
                  />
                </div>
                {enrollment.completedAt && (
                  <p className="text-sm text-muted-foreground">
                    Completed on:{" "}
                    {new Date(enrollment.completedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              {enrollment.status === "completed" && (
                <Button className="w-full" disabled>
                  Completed
                </Button>
              )}

              <Button asChild className="w-full">
                <Link to={`/learning/${enrollment.courseId}`}>
                  {enrollment.status === "completed"
                    ? "Check Full Progress"
                    : "Continue Learning"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {enrollments.length === 0 && (
        <div className="text-center">
          <p className="text-muted-foreground">
            You haven't enrolled in any courses yet.
          </p>
          <Button asChild className="mt-4">
            <Link to="/">Browse Courses</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyLearning;
