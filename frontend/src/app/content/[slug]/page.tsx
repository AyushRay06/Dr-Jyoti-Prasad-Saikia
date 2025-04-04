import React from "react"
import axios from "axios"
import Link from "next/link"
import { FiArrowLeft, FiCalendar, FiTag, FiDownload } from "react-icons/fi"

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

async function getContentBySlug(slug: string) {
  try {
    // Use the correct endpoint that filters by slug
    const response = await axios.get(
      `http://localhost:5000/api/contents/slug/${slug}`
    )
    return response.data
  } catch (error) {
    console.error("Error fetching content:", error)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const content = await getContentBySlug(params.slug)
  return {
    title: content?.title || "Content Not Found",
    description: content?.description || "Content not available",
  }
}

const ContentDetailPage = async ({ params }: { params: { slug: string } }) => {
  const content = await getContentBySlug(params.slug)

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Content Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            The content you're looking for doesn't exist in our library.
          </p>
          <Link
            href="/content"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Content Library
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 pt-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/content"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors font-medium"
          >
            <FiArrowLeft className="mr-2" />
            Back to Content Library
          </Link>
        </div>
      </div>

      <article className="container mx-auto px-4 sm:px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                <FiTag className="mr-1.5" size={14} />
                {content.category.charAt(0).toUpperCase() +
                  content.category.slice(1)}
              </span>
              {content.featured && (
                <span className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-700 text-sm font-medium rounded-full">
                  Featured Content
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight">
              {content.title}
            </h1>

            <p className="text-xl text-gray-600 mb-6 font-light">
              {content.description}
            </p>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center text-gray-500">
                <FiCalendar className="mr-2" size={16} />
                <span className="text-sm">
                  {new Date(content.publishedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              {content.docLink && (
                <a
                  href={content.docLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <FiDownload className="mr-2" size={16} />
                  Download Document
                </a>
              )}
            </div>

            {content.imageUrl && (
              <div className="w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
                <img
                  src={content.imageUrl}
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </header>

          <div className="prose prose-lg max-w-none">
            {content.body ? (
              <div dangerouslySetInnerHTML={{ __html: content.body }} />
            ) : content.docLink ? (
              <div className="text-center py-8">
                <div className="bg-blue-50 p-6 rounded-lg inline-block mb-6">
                  <FiDownload className="text-blue-600 mx-auto" size={48} />
                </div>
                <h3 className="text-xl font-medium mb-2">Document Available</h3>
                <p className="text-gray-600 mb-6">
                  This content is available as a downloadable document.
                </p>
                <a
                  href={content.docLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <FiDownload className="mr-2" />
                  Download Now
                </a>
              </div>
            ) : (
              <p className="text-gray-500 italic">No content available.</p>
            )}
          </div>
        </div>
      </article>

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">
              More {content.category} Content
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  Explore More Content
                </h3>
                <p className="text-gray-600 mb-4">
                  Discover other interesting content in our library.
                </p>
                <Link
                  href="/content"
                  className="text-blue-600 hover:underline font-medium inline-flex items-center"
                >
                  Browse all content
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  Popular in {content.category}
                </h3>
                <p className="text-gray-600 mb-4">
                  Check out trending content in this category.
                </p>
                <Link
                  href={`/content?category=${content.category}`}
                  className="text-blue-600 hover:underline font-medium inline-flex items-center"
                >
                  View category
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentDetailPage
