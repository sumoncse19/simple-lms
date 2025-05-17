import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-primary">
              LMS Platform
            </Link>
            <div className="flex items-center space-x-4">
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
                  isActive("/my-learning") ? "text-primary" : "text-muted-foreground"
                )}
              >
                My Learning
              </Link>
              <Link
                to="/profile"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/profile") ? "text-primary" : "text-muted-foreground"
                )}
              >
                Profile
              </Link>
            </div>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout 