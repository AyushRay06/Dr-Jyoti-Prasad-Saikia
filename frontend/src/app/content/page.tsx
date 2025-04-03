// app/content/page.tsx

import React from "react"
import axios from "axios"
import Link from "next/link"
import { FiBook, FiBookOpen, FiFileText, FiBookmark } from "react-icons/fi"

interface Content {
  id: number
  title: string
  description: string
  body: string
  category: string
  publishedDate: string
  featured?: boolean
  slug: string
  imageUrl?: string
}

interface Book {
  id: string
  title: string
  description: string
  imageURL: string
  buyLink: string
}

const ContentPage = async () => {
  // Fetch data in parallel
  const [contentsRes, booksRes] = await Promise.all([
    axios.get("http://localhost:5000/api/contents"),
    axios.get("http://localhost:5000/api/books"),
  ])

  const contents: Content[] = contentsRes.data
  const books: Book[] = booksRes.data

  // Group contents by category
  const contentByCategory = contents.reduce((acc, content) => {
    if (!acc[content.category]) {
      acc[content.category] = []
    }
    acc[content.category].push(content)
    return acc
  }, {} as Record<string, Content[]>)

  // Category metadata
  const categoryMetadata = {
    blog: {
      title: "Blog Posts",
      icon: <FiFileText className="text-blue-500" size={24} />,
      description: "Thoughts, insights, and updates from our team",
    },
    novel: {
      title: "Novels",
      icon: <FiBookOpen className="text-purple-500" size={24} />,
      description: "Explore our collection of published novels",
    },
    story: {
      title: "Short Stories",
      icon: <FiBookmark className="text-green-500" size={24} />,
      description: "Bite-sized fiction for your reading pleasure",
    },
    // Add more categories as needed
  }

  // Default category metadata
  const getCategoryMetadata = (category: string) => {
    return (
      categoryMetadata[category as keyof typeof categoryMetadata] || {
        title: `${category.charAt(0).toUpperCase()}${category.slice(1)}`,
        icon: <FiFileText className="text-gray-500" size={24} />,
        description: `Articles in the ${category} category`,
      }
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Content Library</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Explore our collection of writings, books, and publications across
            various categories
          </p>
        </div>
      </div>

      {/* Featured Books Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center">
              <FiBook className="mr-2 text-orange-500" size={24} />
              Featured Books
            </h2>
            <Link href="/books" className="text-blue-600 hover:underline">
              View All Books
            </Link>
          </div>

          {books.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No books available yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {books.slice(0, 4).map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-gray-100">
                    {book.imageURL ? (
                      <img
                        src={`${
                          process.env.NEXT_PUBLIC_IMAGEKIT_URL
                        }/tr:w-500,h-250/${book.imageURL.split("/").pop()}`}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No cover image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{book.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {book.description}
                    </p>
                    <a
                      href={book.buyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Get the Book
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content by Category */}
      {Object.entries(contentByCategory).map(([category, items]) => {
        const meta = getCategoryMetadata(category)

        return (
          <section key={category} className="py-12 bg-gray-50 even:bg-white">
            <div className="container mx-auto px-6">
              <div className="flex items-center mb-8">
                <div className="mr-4 p-3 bg-gray-100 rounded-full">
                  {meta.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{meta.title}</h2>
                  <p className="text-gray-600">{meta.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((content) => (
                  <div
                    key={content.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {content.imageUrl && (
                      <div className="h-48 bg-gray-100">
                        <img
                          src={content.imageUrl}
                          alt={content.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full capitalize">
                          {content.category}
                        </span>
                        {content.featured && (
                          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-xl mb-2">
                        {content.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {content.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {new Date(content.publishedDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                        <Link
                          href={`/content/${content.slug}`}
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default ContentPage
