// app/content/[slug]/page.tsx

import React from "react"
import axios from "axios"
import Link from "next/link"
import { FiArrowLeft, FiCalendar, FiTag } from "react-icons/fi"

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

const ContentDetailPage = async ({ params }: { params: { slug: string } }) => {
  // Fetch content by slug
  const response = await axios.get(
    `http://localhost:5000/api/contents?slug=${params.slug}`
  )
  const content: Content = response.data[0]

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Content Not Found</h1>
          <p className="text-xl mb-6">
            The content you're looking for doesn't exist.
          </p>
          <Link
            href="/content"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Content Library
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Article Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-8">
          <Link
            href="/content"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <FiArrowLeft className="mr-2" />
            Back to Content Library
          </Link>

          <div className="flex flex-col md:flex-row gap-8">
            {content.imageUrl && (
              <div className="md:w-1/3 lg:w-1/4">
                <img
                  src={content.imageUrl}
                  alt={content.title}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}
            <div className={content.imageUrl ? "md:w-2/3 lg:w-3/4" : "w-full"}>
              <div className="flex items-center space-x-4 mb-4">
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  <FiTag className="mr-1" />
                  {content.category.charAt(0).toUpperCase() +
                    content.category.slice(1)}
                </span>
                {content.featured && (
                  <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {content.title}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {content.description}
              </p>
              <div className="flex items-center text-gray-500">
                <FiCalendar className="mr-2" />
                <span>
                  {new Date(content.publishedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content.body }}
          />
        </div>
      </div>

      {/* Related Content Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">
            More{" "}
            {content.category.charAt(0).toUpperCase() +
              content.category.slice(1)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* In a real app, you would fetch related content here */}
            {/* For now, this is a placeholder */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">
                More content coming soon
              </h3>
              <p className="text-gray-600 mb-4">
                We're working on adding more {content.category} content.
              </p>
              <Link href="/content" className="text-blue-600 hover:underline">
                Explore all content
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentDetailPage
