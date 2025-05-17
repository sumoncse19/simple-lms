import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Course, Enrollment } from '@/types'
import { getEnrollments, getCourse } from '@/services/storage'

const MyLearning = () => {
  const [enrollments, setEnrollments] = useState<Array<Enrollment & { course: Course }>>([])

  useEffect(() => {
    const loadEnrollments = () => {
      const userEnrollments = getEnrollments()
      const enrollmentsWithCourses = userEnrollments.map(enrollment => {
        const course = getCourse(enrollment.courseId)
        if (!course) return null
        return { ...enrollment, course }
      }).filter((item): item is Enrollment & { course: Course } => item !== null)
      setEnrollments(enrollmentsWithCourses)
    }

    loadEnrollments()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Learning</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {enrollments.map((enrollment) => (
          <Card key={enrollment.courseId} className="flex flex-col">
            <CardHeader>
              <CardTitle>{enrollment.course.title}</CardTitle>
              <CardDescription>{enrollment.course.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Duration: {enrollment.course.duration} hours
                </p>
                <p className="text-sm text-muted-foreground">
                  Level: {enrollment.course.level}
                </p>
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground">Progress</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {enrollment.progress}% Complete
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={`/courses/${enrollment.courseId}`}>Continue Learning</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {enrollments.length === 0 && (
        <div className="text-center">
          <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
          <Button asChild className="mt-4">
            <Link to="/">Browse Courses</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default MyLearning 