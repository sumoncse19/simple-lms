import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "./ui/button";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-primary">
              LMS Platform
            </Link>
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="text-muted-foreground"
              >
                {isMobileMenuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                )}
              </Button>
            </div>

            {/* Mobile Menu Items */}
            <div
              className={cn(
                "absolute top-16 left-0 w-full shadow-lg rounded-lg p-4 md:hidden transition-all duration-200 ease-in-out",
                isMobileMenuOpen
                  ? "opacity-100 translate-y-0 bg-white z-10"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              )}
            >
              <div className="flex flex-col space-y-4">
                <Link
                  to="/"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive("/") ? "text-primary" : "text-muted-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link
                  to="/my-learning"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive("/my-learning")
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Learning
                </Link>
                <Link
                  to="/learning-history"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive("/learning-history")
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Learning History
                </Link>
                <Link
                  to="/profile"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive("/profile")
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/") ? "text-primary" : "text-muted-foreground"
                )}
              >
                Courses
              </Link>
              <Link
                to="/my-learning"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/my-learning")
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                My Learning
              </Link>
              <Link
                to="/learning-history"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/learning-history")
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                Learning History
              </Link>
              <Link
                to="/profile"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/profile")
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                Profile
              </Link>
            </div>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
      <Toaster />
    </div>
  );
};

export default Layout;
