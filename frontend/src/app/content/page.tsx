import React from "react"
import axios from "axios"
import Link from "next/link"
import {
  FiBook,
  FiBookOpen,
  FiFileText,
  FiBookmark,
  FiDownload,
} from "react-icons/fi"

interface Content {
  id: number
  title: string
  description: string
  body?: string
  docLink?: string
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
  const [contentsRes, booksRes] = await Promise.all([
    axios.get("http://localhost:5000/api/contents"),
    axios.get("http://localhost:5000/api/books"),
  ])

  const contents: Content[] = contentsRes.data
  const books: Book[] = booksRes.data

  const contentByCategory = contents.reduce((acc, content) => {
    if (!acc[content.category]) {
      acc[content.category] = []
    }
    acc[content.category].push(content)
    return acc
  }, {} as Record<string, Content[]>)

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
  }

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
      <div className=" text-black py-6">
        <div className="container max-w-4xl shadow-md hover rounded-2xl  overflow-hidden hover:shadow-lg transition-shadow py-4  mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Content Library</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Explore our collection of writings, books, and publications across
            various categories
          </p>
        </div>
      </div>

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
                        <div className="flex space-x-2">
                          {content.docLink && (
                            <a
                              href={content.docLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                              title="Download Document"
                            >
                              <FiDownload className="mr-1" size={14} />
                            </a>
                          )}
                          <Link
                            href={`/content/${content.slug}`}
                            className="text-blue-600 hover:underline text-sm font-medium"
                          >
                            Read More
                          </Link>
                        </div>
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
