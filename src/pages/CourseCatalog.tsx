import { useEffect, useState, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import type { Course } from "@/types";
import { getCourses } from "@/services/storage";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 5;
const SEARCH_DEBOUNCE_MS = 300;

const CourseCatalog = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("title");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isShowCourseFilter, setIsShowCourseFilter] = useState(true);

  const debouncedSearch = useCallback(() => {
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadCourses = () => {
      try {
        setIsLoading(true);
        setError(null);
        // Get all courses without pagination
        const courses = getCourses();
        setAllCourses(courses);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(courses.map((course) => course.category))
        );
        setCategories(uniqueCategories);
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
        console.error("Error loading courses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleResize = () => {
    if (window.innerWidth > 768) {
      setIsShowCourseFilter(true);
    } else {
      setIsShowCourseFilter(false);
    }
  };

  window.addEventListener("resize", handleResize);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(true);
    setCurrentPage(1); // Reset to first page on new search
    debouncedSearch();
  };

  // Filter and sort courses
  const filteredAndSortedCourses = allCourses
    .filter((course) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.category.toLowerCase().includes(searchLower);
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

  // Apply pagination to filtered results
  const paginatedCourses = filteredAndSortedCourses.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalPages = Math.ceil(filteredAndSortedCourses.length / PAGE_SIZE);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceFilter, sortBy]);

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
        <p className="text-sm text-yellow-500">
          Showing {filteredAndSortedCourses.length} courses
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex md:hidden justify-between items-center">
          <h4 className="text-xl font-bold">Course Filter</h4>
          <Button
            variant="outline"
            onClick={() => setIsShowCourseFilter((prev) => !prev)}
            className={cn(
              "md:hidden px-2 py-1 transition-all duration-300 ease-in-out",
              isShowCourseFilter && "rotate-180"
            )}
          >
            <svg
              fill="#000000"
              height="12px"
              width="16px"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 330 330"
              xmlSpace="preserve"
            >
              <path
                id="XMLID_225_"
                d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
	c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
	s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
              />
            </svg>
          </Button>
        </div>

        {isShowCourseFilter && (
          <div
            className={cn(
              "space-y-4 transition-all duration-300 ease-in-out bg-white",
              isShowCourseFilter ? "h-auto" : "h-0"
            )}
          >
            <div className="grid gap-4 md:grid-cols-4">
              <div className="md:col-span-2 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search courses by title, description, or category..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-9"
                    aria-label="Search courses"
                  />
                </div>
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Sort by Title</SelectItem>
                  <SelectItem value="duration">Sort by Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedCourses.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{course.title}</CardTitle>
                <Badge variant={course.isFree ? "secondary" : "default"}>
                  {course.isFree ? "Free" : "Paid"}
                </Badge>
              </div>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2">
                <p className="text-sm text-yellow-500">
                  <span className="font-bold text-muted-foreground">
                    Category:
                  </span>{" "}
                  {course.category}
                </p>
                <p className="text-sm text-red-500">
                  <span className="font-bold text-muted-foreground">
                    Duration:
                  </span>{" "}
                  {course.duration} hours
                </p>
                <p className="text-sm text-green-500">
                  <span className="font-bold text-muted-foreground">
                    Level:
                  </span>{" "}
                  {course.level}
                </p>
                <p className="text-sm text-blue-500">
                  <span className="font-bold text-muted-foreground">
                    Instructor:
                  </span>{" "}
                  {course.instructor}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={`/courses/${course.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredAndSortedCourses.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchQuery
              ? "No courses found matching your search criteria."
              : "No courses found matching your filters."}
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </Button>
          )}
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
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;
