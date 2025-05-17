import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Course, Enrollment } from '@/types'
import { getEnrollments, getCourse } from '@/services/storage'

const LearningHistory = () => {
  const [completedCourses, setCompletedCourses] = useState<Array<Enrollment & { course: Course }>>([])

  useEffect(() => {
    const loadCompletedCourses = () => {
      const userEnrollments = getEnrollments()
      const completedEnrollments = userEnrollments
        .filter(enrollment => enrollment.completedAt)
        .map(enrollment => {
          const course = getCourse(enrollment.courseId)
          if (!course) return null
          return { ...enrollment, course }
        })
        .filter((item): item is Enrollment & { course: Course } => item !== null)
        .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())

      setCompletedCourses(completedEnrollments)
    }

    loadCompletedCourses()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Learning History</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {completedCourses.map((enrollment) => (
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
                <p className="text-sm text-muted-foreground">
                  Completed on: {new Date(enrollment.completedAt!).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to={`/courses/${enrollment.courseId}`}>Review Course</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {completedCourses.length === 0 && (
        <div className="text-center">
          <p className="text-muted-foreground">You haven't completed any courses yet.</p>
          <Button asChild className="mt-4">
            <Link to="/">Browse Courses</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default LearningHistory 