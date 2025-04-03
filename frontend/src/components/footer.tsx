import Link from "next/link"

import { Separator } from "@/components/ui/separator"
import { BookOpen, Twitter, Instagram, Youtube, ArrowRight } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted max-w-[2100px] mx-auto px-4 ">
      <div className="container  px-4 md:px-12 py-12 md:py-16 lg:py-20">
        <div className="grid gap-16 md:grid-cols-2 ">
          {/* Author Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <span className="text-lg font-bold">Dr. Jyoti Prasad Saikia</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Award-winning novelist and storyteller with over 20 years of
              experience crafting compelling narratives that captivate readers
              worldwide.
            </p>
            <div className="flex space-x-3">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>

              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-medium">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="/books"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Books
              </Link>
              <Link
                href="/poems"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Poems
              </Link>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Author Name. All rights reserved.
          </p>
          <nav className="flex gap-4 text-xs text-muted-foreground">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/accessibility"
              className="hover:text-foreground transition-colors"
            >
              Accessibility
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
