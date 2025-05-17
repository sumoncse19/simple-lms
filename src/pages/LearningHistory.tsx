import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Course, Enrollment } from "@/types";
import { getEnrollments, getCourse } from "@/services/storage";

const LearningHistory = () => {
  const [completedCourses, setCompletedCourses] = useState<
    Array<Enrollment & { course: Course }>
  >([]);
  const [summary, setSummary] = useState({ totalCourses: 0, totalHours: 0 });

  useEffect(() => {
    const loadCompletedCourses = () => {
      const userEnrollments = getEnrollments();
      const completedEnrollments = userEnrollments
        .filter((enrollment) => enrollment.completedAt)
        .map((enrollment) => {
          const course = getCourse(enrollment.courseId);
          if (!course) return null;
          return { ...enrollment, course };
        })
        .filter(
          (item): item is Enrollment & { course: Course } => item !== null
        )
        .sort(
          (a, b) =>
            new Date(b.completedAt!).getTime() -
            new Date(a.completedAt!).getTime()
        );

      setCompletedCourses(completedEnrollments);

      // Calculate summary statistics
      const totalHours = completedEnrollments.reduce(
        (sum, enrollment) => sum + enrollment.course.duration,
        0
      );
      setSummary({
        totalCourses: completedEnrollments.length,
        totalHours,
      });
    };

    loadCompletedCourses();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Learning History</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Courses Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.totalCourses}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Learning Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.totalHours} hours</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completed Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Completed On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedCourses.map((enrollment) => (
                <TableRow key={enrollment.courseId}>
                  <TableCell className="font-medium">
                    {enrollment.course.title}
                  </TableCell>
                  <TableCell>{enrollment.course.category}</TableCell>
                  <TableCell>{enrollment.course.duration} hours</TableCell>
                  <TableCell>
                    {new Date(enrollment.completedAt!).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/courses/${enrollment.courseId}`}>Review</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {completedCourses.length === 0 && (
        <div className="text-center">
          <p className="text-muted-foreground">
            You haven't completed any courses yet.
          </p>
          <Button asChild className="mt-4">
            <Link to="/">Browse Courses</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default LearningHistory;
