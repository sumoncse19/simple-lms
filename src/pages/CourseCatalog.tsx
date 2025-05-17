import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Course } from "@/types";
import { getCourses, getTotalCourses } from "@/services/storage";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

const CourseCatalog = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("title");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = () => {
      try {
        setIsLoading(true);
        setError(null);
        const allCourses = getCourses(currentPage, PAGE_SIZE);
        setCourses(allCourses);
        setTotalCourses(getTotalCourses());
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
        console.error("Error loading courses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [currentPage]);

  // Get unique categories for filter
  const categories = [
    "all",
    ...new Set(courses.map((course) => course.category)),
  ];

  // Filter and sort courses
  const filteredAndSortedCourses = courses
    .filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "free" && course.isFree) ||
        (priceFilter === "paid" && !course.isFree);

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "duration") {
        return a.duration - b.duration;
      }
      return 0;
    });

  const totalPages = Math.ceil(totalCourses / PAGE_SIZE);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Course Catalog</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-4">
          <Input
            type="search"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search courses"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="category-filter">
              Category
            </label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="price-filter">
              Price
            </label>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger id="price-filter">
                <SelectValue placeholder="Select price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="sort-by">
              Sort By
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort-by">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedCourses.map((course) => (
              <Card key={course.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 flex flex-col justify-between">
                  <div className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                      Category: {course.category}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Duration: {course.duration} hours
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Level: {course.level}
                    </p>
                  </div>
                  <p
                    className={cn(
                      course.isFree ? "bg-green-600" : "bg-red-600",
                      "text-sm font-medium px-2 py-1 rounded-md w-fit text-white"
                    )}
                  >
                    {course.isFree ? "Free" : "Paid"}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={`/courses/${course.id}`}>View Course</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredAndSortedCourses.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No courses found matching your criteria.
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCatalog;
