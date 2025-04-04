"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import ImageKit from "imagekit"
import {
  FiEdit,
  FiTrash2,
  FiEye,
  FiMail,
  FiBook,
  FiFileText,
  FiLogOut,
  FiPlus,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiUpload,
  FiLink,
} from "react-icons/fi"
import { FaStar, FaRegStar, FaEye, FaEyeSlash } from "react-icons/fa"

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

interface Contact {
  id: number
  name: string
  email: string
  subject: string
  message: string
  seen: boolean
  createdAt: string
}

const imagekit = new ImageKit({
  publicKey: "public_9qF4YuVQUcUdySZrUjqHlGj6Or4=",
  privateKey: "private_S/Pq6ODO0jQaszzQNtSOWhHB3vA=",
  urlEndpoint: "https://ik.imagekit.io/ayushray",
})

const DashboardPage: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [activeTab, setActiveTab] = useState<"contents" | "books" | "contacts">(
    "contents"
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState({
    contents: 0,
    books: 0,
    unreadMessages: 0,
  })

  const [showContentModal, setShowContentModal] = useState(false)
  const [showBookModal, setShowBookModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [currentContact, setCurrentContact] = useState<Contact | null>(null)

  const [contentForm, setContentForm] = useState<
    Omit<Content, "id" | "publishedDate">
  >({
    title: "",
    description: "",
    body: "",
    docLink: "",
    category: "",
    imageUrl: "",
    featured: false,
    slug: "",
  })

  const [bookForm, setBookForm] = useState<Omit<Book, "id">>({
    title: "",
    description: "",
    imageURL: "",
    buyLink: "",
  })

  const [contentImageFile, setContentImageFile] = useState<File | null>(null)
  const [contentImageUploading, setContentImageUploading] = useState(false)
  const [bookImageFile, setBookImageFile] = useState<File | null>(null)
  const [bookImageUploading, setBookImageUploading] = useState(false)

  const [currentPage, setCurrentPage] = useState({
    contents: 1,
    books: 1,
    contacts: 1,
  })
  const itemsPerPage = 10

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated || isAuthenticated !== "true") {
      window.location.href = "/admin"
    }
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [contentsRes, booksRes, contactsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/contents"),
        axios.get("http://localhost:5000/api/books"),
        axios.get("http://localhost:5000/api/contacts"),
      ])

      setContents(contentsRes.data)
      setBooks(booksRes.data)
      setContacts(contactsRes.data)

      setStats({
        contents: contentsRes.data.length,
        books: booksRes.data.length,
        unreadMessages: contactsRes.data.filter((c: Contact) => !c.seen).length,
      })
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to load dashboard data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const uploadContentImage = async () => {
    if (!contentImageFile) return

    setContentImageUploading(true)
    try {
      const response = await imagekit.upload({
        //@ts-ignore-
        file: contentImageFile,
        fileName: `content_${Date.now()}`,
        folder: "/content",
      })
      //@ts-ignore-
      setContentForm({ ...contentForm, imageUrl: response.url })
      setContentImageUploading(false)
      //@ts-ignore-
      return response.url
    } catch (error) {
      console.error("Error uploading content image:", error)
      setContentImageUploading(false)
      throw error
    }
  }

  const uploadBookImage = async () => {
    if (!bookImageFile) return

    setBookImageUploading(true)
    try {
      const response = await imagekit.upload({
        //@ts-ignore-
        file: bookImageFile,
        fileName: `book_${Date.now()}`,
        folder: "/book",
      })
      //@ts-ignore-
      setBookForm({ ...bookImageFile, imageURL: response.url })
      setBookImageUploading(false)
      //@ts-ignore-
      return response.url
    } catch (error) {
      console.error("Error uploading book image:", error)
      setBookImageUploading(false)
      throw error
    }
  }

  const handleDeleteContent = async (id: number) => {
    if (!confirm("Are you sure you want to delete this content?")) return

    try {
      await axios.delete(`http://localhost:5000/api/contents/${id}`)
      setContents(contents.filter((content) => content.id !== id))
      setStats((prev) => ({ ...prev, contents: prev.contents - 1 }))
    } catch (error) {
      console.error("Error deleting content:", error)
      alert("Failed to delete content. Please try again.")
    }
  }

  const handleSubmitContent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let imageUrl = contentForm.imageUrl
      if (contentImageFile) {
        imageUrl = await uploadContentImage()
      }

      const response = await axios.post("http://localhost:5000/api/contents", {
        ...contentForm,
        imageUrl,
        publishedDate: new Date().toISOString(),
      })

      if (response.status === 201) {
        setContents([response.data, ...contents])
        setStats((prev) => ({ ...prev, contents: prev.contents + 1 }))
        setShowContentModal(false)
        setContentForm({
          title: "",
          description: "",
          body: "",
          docLink: "",
          category: "",
          imageUrl: "",
          featured: false,
          slug: "",
        })
        setContentImageFile(null)
      }
    } catch (error) {
      console.error("Error creating content:", error)
      alert("Failed to create content. Please try again.")
    }
  }

  const handleDeleteBook = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return

    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`)
      setBooks(books.filter((book) => book.id !== id))
      setStats((prev) => ({ ...prev, books: prev.books - 1 }))
    } catch (error) {
      console.error("Error deleting book:", error)
      alert("Failed to delete book. Please try again.")
    }
  }

  const handleSubmitBook = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let imageURL = bookForm.imageURL
      if (bookImageFile) {
        imageURL = await uploadBookImage()
      }

      const response = await axios.post("http://localhost:5000/api/books", {
        ...bookForm,
        imageURL,
      })

      if (response.status === 201) {
        setBooks([response.data, ...books])
        setStats((prev) => ({ ...prev, books: prev.books + 1 }))
        setShowBookModal(false)
        setBookForm({
          title: "",
          description: "",
          imageURL: "",
          buyLink: "",
        })
        setBookImageFile(null)
      }
    } catch (error) {
      console.error("Error creating book:", error)
      alert("Failed to create book. Please try again.")
    }
  }

  const handleMarkContactAsSeen = async (
    id: number,
    currentSeenStatus: boolean
  ) => {
    try {
      await axios.patch(`http://localhost:5000/api/contacts/${id}`, {
        seen: !currentSeenStatus,
      })
      setContacts(
        contacts.map((contact) =>
          contact.id === id ? { ...contact, seen: !currentSeenStatus } : contact
        )
      )

      setStats((prev) => ({
        ...prev,
        unreadMessages: currentSeenStatus
          ? prev.unreadMessages + 1
          : prev.unreadMessages - 1,
      }))
    } catch (error) {
      console.error("Error updating contact:", error)
      alert("Failed to update contact status. Please try again.")
    }
  }

  const handleViewContact = (contact: Contact) => {
    setCurrentContact(contact)
    setShowContactModal(true)

    if (!contact.seen) {
      handleMarkContactAsSeen(contact.id, false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    window.location.href = "/admin"
  }

  const filteredContents = contents.filter(
    (content) =>
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedContents = filteredContents.slice(
    (currentPage.contents - 1) * itemsPerPage,
    currentPage.contents * itemsPerPage
  )

  const paginatedBooks = filteredBooks.slice(
    (currentPage.books - 1) * itemsPerPage,
    currentPage.books * itemsPerPage
  )

  const paginatedContacts = filteredContacts.slice(
    (currentPage.contacts - 1) * itemsPerPage,
    currentPage.contacts * itemsPerPage
  )

  const totalPages = {
    contents: Math.ceil(filteredContents.length / itemsPerPage),
    books: Math.ceil(filteredBooks.length / itemsPerPage),
    contacts: Math.ceil(filteredContacts.length / itemsPerPage),
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <p className="text-red-500 mb-4 text-lg">{error}</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={fetchData}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <nav className="p-4">
          <div
            className={`flex items-center p-3 rounded-lg cursor-pointer mb-2 ${
              activeTab === "contents"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("contents")}
          >
            <FiFileText className="mr-3" />
            <span>Contents</span>
            <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {stats.contents}
            </span>
          </div>
          <div
            className={`flex items-center p-3 rounded-lg cursor-pointer mb-2 ${
              activeTab === "books"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("books")}
          >
            <FiBook className="mr-3" />
            <span>Books</span>
            <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {stats.books}
            </span>
          </div>
          <div
            className={`flex items-center p-3 rounded-lg cursor-pointer ${
              activeTab === "contacts"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("contacts")}
          >
            <FiMail className="mr-3" />
            <span>Messages</span>
            {stats.unreadMessages > 0 && (
              <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                {stats.unreadMessages}
              </span>
            )}
          </div>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <FiLogOut className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      <div className="ml-64 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {activeTab === "contents" && "Content Management"}
            {activeTab === "books" && "Book Management"}
            {activeTab === "contacts" && "Contact Messages"}
          </h2>
          <p className="text-gray-600">
            {activeTab === "contents" && "Manage your blog posts and articles"}
            {activeTab === "books" && "Manage your published books"}
            {activeTab === "contacts" && "View and respond to visitor messages"}
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <button
            onClick={() =>
              activeTab === "contents"
                ? setShowContentModal(true)
                : setShowBookModal(true)
            }
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${
              activeTab === "contacts" ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={activeTab === "contacts"}
          >
            <FiPlus className="mr-2" />
            Add New
          </button>
        </div>

        {activeTab === "contents" && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {filteredContents.length === 0 ? (
              <div className="p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No content found
                </h3>
                <p className="mt-1 text-gray-500">
                  Get started by creating a new content item.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowContentModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add New Content
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Title
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Category
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Published
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedContents.map((content) => (
                        <tr key={content.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {content.imageUrl && (
                                <div className="flex-shrink-0 h-10 w-10 mr-4">
                                  <img
                                    className="h-10 w-10 rounded-md object-cover"
                                    src={content.imageUrl}
                                    alt={content.title}
                                  />
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {content.title}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                              {content.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(content.publishedDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {content.featured ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <FaStar className="mr-1" /> Featured
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <FaRegStar className="mr-1" /> Regular
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <a
                                href={`/admin/contents/edit/${content.id}`}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <FiEdit size={18} />
                              </a>
                              <button
                                onClick={() => handleDeleteContent(content.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalPages.contents > 1 && (
                  <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => ({
                          ...prev,
                          contents: Math.max(prev.contents - 1, 1),
                        }))
                      }
                      disabled={currentPage.contents === 1}
                      className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      <FiChevronLeft className="mr-1" /> Previous
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage.contents} of {totalPages.contents}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => ({
                          ...prev,
                          contents: Math.min(
                            prev.contents + 1,
                            totalPages.contents
                          ),
                        }))
                      }
                      disabled={currentPage.contents === totalPages.contents}
                      className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next <FiChevronRight className="ml-1" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "books" && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {filteredBooks.length === 0 ? (
              <div className="p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  ></path>
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No books found
                </h3>
                <p className="mt-1 text-gray-500">
                  Get started by adding a new book.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowBookModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add New Book
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {paginatedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                        {book.imageURL ? (
                          <img
                            src={book.imageURL}
                            alt={book.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-gray-400">No cover image</span>
                        )}
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          Book
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-lg mb-2 text-gray-800">
                          {book.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {book.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <a
                            href={book.buyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            View on Store
                          </a>
                          <div className="flex space-x-2">
                            <a
                              href={`/admin/books/edit/${book.id}`}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Edit"
                            >
                              <FiEdit size={16} />
                            </a>
                            <button
                              onClick={() => handleDeleteBook(book.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Delete"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages.books > 1 && (
                  <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => ({
                          ...prev,
                          books: Math.max(prev.books - 1, 1),
                        }))
                      }
                      disabled={currentPage.books === 1}
                      className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      <FiChevronLeft className="mr-1" /> Previous
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage.books} of {totalPages.books}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => ({
                          ...prev,
                          books: Math.min(prev.books + 1, totalPages.books),
                        }))
                      }
                      disabled={currentPage.books === totalPages.books}
                      className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next <FiChevronRight className="ml-1" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No messages found
                </h3>
                <p className="mt-1 text-gray-500">
                  All caught up! No contact messages to display.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          From
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Subject
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedContacts.map((contact) => (
                        <tr
                          key={contact.id}
                          className={
                            !contact.seen
                              ? "bg-blue-50 hover:bg-blue-100"
                              : "hover:bg-gray-50"
                          }
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium">
                                  {contact.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {contact.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {contact.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {contact.subject}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                              {contact.message}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {formatDate(contact.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {contact.seen ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FaEye className="mr-1" /> Read
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <FaEyeSlash className="mr-1" /> Unread
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() =>
                                  handleMarkContactAsSeen(
                                    contact.id,
                                    contact.seen
                                  )
                                }
                                className={
                                  contact.seen
                                    ? "text-blue-600 hover:text-blue-900"
                                    : "text-green-600 hover:text-green-900"
                                }
                                title={
                                  contact.seen
                                    ? "Mark as Unread"
                                    : "Mark as Read"
                                }
                              >
                                {contact.seen ? (
                                  <FaEyeSlash size={18} />
                                ) : (
                                  <FaEye size={18} />
                                )}
                              </button>
                              <button
                                onClick={() => handleViewContact(contact)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="View Details"
                              >
                                <FiEye size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalPages.contacts > 1 && (
                  <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => ({
                          ...prev,
                          contacts: Math.max(prev.contacts - 1, 1),
                        }))
                      }
                      disabled={currentPage.contacts === 1}
                      className="flex items-center px-3 py-1 border border-gray-rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      <FiChevronLeft className="mr-1" /> Previous
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage.contacts} of {totalPages.contacts}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => ({
                          ...prev,
                          contacts: Math.min(
                            prev.contacts + 1,
                            totalPages.contacts
                          ),
                        }))
                      }
                      disabled={currentPage.contacts === totalPages.contacts}
                      className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next <FiChevronRight className="ml-1" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {showContentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Create New Content</h3>
                <button
                  onClick={() => setShowContentModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmitContent}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={contentForm.title}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          title: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={contentForm.slug}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, slug: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                      value={contentForm.description}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content Body (Optional)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                      rows={8}
                      value={contentForm.body}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, body: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Document Link (Optional)
                    </label>
                    <div className="flex items-center">
                      <FiLink className="mr-2 text-gray-400" />
                      <input
                        type="url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={contentForm.docLink}
                        onChange={(e) =>
                          setContentForm({
                            ...contentForm,
                            docLink: e.target.value,
                          })
                        }
                        placeholder="https://example.com/document.pdf"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={contentForm.category}
                        onChange={(e) =>
                          setContentForm({
                            ...contentForm,
                            category: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="blog">Blog</option>
                        <option value="story">Story</option>
                        <option value="novel">Novel</option>
                        <option value="book">Book</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Featured Image
                      </label>
                      <div className="flex items-center">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          {contentImageFile ? (
                            <div className="relative w-full h-full">
                              <img
                                src={URL.createObjectURL(contentImageFile)}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setContentImageFile(null)
                                }}
                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-200"
                              >
                                <FiX className="text-red-500" />
                              </button>
                            </div>
                          ) : contentForm.imageUrl ? (
                            <div className="relative w-full h-full">
                              <img
                                src={contentForm.imageUrl}
                                alt="Current Image"
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setContentForm({
                                    ...contentForm,
                                    imageUrl: "",
                                  })
                                }}
                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-200"
                              >
                                <FiX className="text-red-500" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <FiUpload className="w-8 h-8 mb-3 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF (MAX. 5MB)
                              </p>
                            </div>
                          )}
                          <input
                            id="content-image-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setContentImageFile(e.target.files[0])
                              }
                            }}
                          />
                        </label>
                      </div>
                      {contentImageUploading && (
                        <div className="mt-2 text-sm text-gray-500">
                          Uploading image...
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={contentForm.featured}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          featured: e.target.checked,
                        })
                      }
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Mark as featured content
                    </label>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowContentModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                    disabled={contentImageUploading}
                  >
                    {contentImageUploading ? "Uploading..." : "Create Content"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add New Book</h3>
                <button
                  onClick={() => setShowBookModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmitBook}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={bookForm.title}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                      value={bookForm.description}
                      onChange={(e) =>
                        setBookForm({
                          ...bookForm,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Image
                    </label>
                    <div className="flex items-center">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        {bookImageFile ? (
                          <div className="relative w-full h-full">
                            <img
                              src={URL.createObjectURL(bookImageFile)}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setBookImageFile(null)
                              }}
                              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-200"
                            >
                              <FiX className="text-red-500" />
                            </button>
                          </div>
                        ) : bookForm.imageURL ? (
                          <div className="relative w-full h-full">
                            <img
                              src={bookForm.imageURL}
                              alt="Current Image"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setBookForm({
                                  ...bookForm,
                                  imageURL: "",
                                })
                              }}
                              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-200"
                            >
                              <FiX className="text-red-500" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FiUpload className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF (MAX. 5MB)
                            </p>
                          </div>
                        )}
                        <input
                          id="book-image-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setBookImageFile(e.target.files[0])
                            }
                          }}
                        />
                      </label>
                    </div>
                    {bookImageUploading && (
                      <div className="mt-2 text-sm text-gray-500">
                        Uploading image...
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Buy Link *
                    </label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={bookForm.buyLink}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, buyLink: e.target.value })
                      }
                      placeholder="https://example.com/buy"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowBookModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                    disabled={bookImageUploading}
                  >
                    {bookImageUploading ? "Uploading..." : "Add Book"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showContactModal && currentContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Message Details</h3>
                <button
                  onClick={() => {
                    setShowContactModal(false)
                    setCurrentContact(null)
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    From
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentContact.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentContact.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Date
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(currentContact.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Subject
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentContact.subject}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Message
                  </label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-900 whitespace-pre-line">
                      {currentContact.message}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() =>
                      handleMarkContactAsSeen(
                        currentContact.id,
                        currentContact.seen
                      )
                    }
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentContact.seen
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    {currentContact.seen ? "Mark as Unread" : "Mark as Read"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
