// app/books/page.tsx

import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FiBook, FiExternalLink, FiSearch } from "react-icons/fi"
import axios from "axios"

interface Book {
  id: string
  title: string
  description: string
  imageURL: string
  buyLink: string
}

const BooksPage = async () => {
  const response = await axios.get("http://localhost:5000/api/books")
  const books: Book[] = response.data

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Now properly centered */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/10 to-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Our Book Collection
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Discover thoughtfully curated works from our authors
              </p>
            </div>
            <div className="w-full max-w-md mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Book Grid - Now properly centered */}
      <section className="w-full py-12 md:py-16">
        <div className="container px-4 md:px-6 mx-auto">
          {books.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-4 text-center h-[300px]">
              <FiBook className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">
                No books available yet. Check back soon.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                {books.map((book) => (
                  <Card
                    key={book.id}
                    className="hover:shadow-md transition-shadow w-full max-w-sm"
                  >
                    <CardHeader>
                      <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4">
                        {book.imageURL && (
                          <img
                            src={`${
                              process.env.NEXT_PUBLIC_IMAGEKIT_URL
                            }/tr:w-500,h-667/${book.imageURL.split("/").pop()}`}
                            alt={book.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <CardTitle className="text-lg line-clamp-1">
                        {book.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {book.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button asChild className="w-full" variant="outline">
                        <a
                          href={book.buyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          Purchase <FiExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default BooksPage
