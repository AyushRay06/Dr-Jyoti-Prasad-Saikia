import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import prisma from "./config/db"

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

// Home route
app.get("/", (req, res) => {
  res.send("Hello, Express with TypeScript!")
})

// ==================== CONTACT ENDPOINTS ====================

// Create contact
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      res.status(400).json({ error: "All fields are required." })
      return
    }

    const contactForm = await prisma.contact.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    })

    if (!contactForm) {
      res.status(500).json({ error: "Failed to submit the form." })
      return
    }

    res.status(200).json({ message: "Form submitted successfully!" })
  } catch (error) {
    console.error("Error submitting form:", error)
    res.status(500).json({ error: "Internal server error." })
  }
})

// Get all contacts
app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    res.status(200).json(contacts)
  } catch (error) {
    console.error("Error fetching contacts:", error)
    res.status(500).json({ error: "Internal server error." })
  }
})

// Get contact by ID
app.get("/api/contacts/:id", async (req, res) => {
  try {
    const { id } = req.params
    const contact = await prisma.contact.findUnique({
      where: {
        id: parseInt(id),
      },
    })

    if (!contact) {
      res.status(404).json({ error: "Contact not found" })
      return
    }

    res.status(200).json(contact)
  } catch (error) {
    console.error("Error fetching contact:", error)
    res.status(500).json({ error: "Internal server error." })
  }
})

// Update contact seen status
app.patch("/api/contacts/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { seen } = req.body

    if (seen === undefined) {
      res.status(400).json({ error: "Seen status is required" })
      return
    }

    const updatedContact = await prisma.contact.update({
      where: {
        id: parseInt(id),
      },
      data: {
        seen,
      },
    })

    res.status(200).json(updatedContact)
  } catch (error) {
    console.error("Error updating contact:", error)
    res.status(500).json({ error: "Internal server error." })
  }
})

// Delete contact
app.delete("/api/contacts/:id", async (req, res) => {
  try {
    const { id } = req.params

    await prisma.contact.delete({
      where: {
        id: parseInt(id),
      },
    })

    res.status(200).json({ message: "Contact deleted successfully" })
  } catch (error) {
    console.error("Error deleting contact:", error)
    res.status(500).json({ error: "Internal server error." })
  }
})

// ==================== CONTENT ENDPOINTS ====================

// Get all contents
app.get("/api/contents", async (req, res) => {
  try {
    const contents = await prisma.content.findMany({
      orderBy: {
        publishedDate: "desc",
      },
    })
    res.status(200).json(contents)
  } catch (error) {
    console.error("Error fetching contents:", error)
    res.status(500).json({ error: "Internal server error." })
  }
})

// Get content by ID
app.get("/api/contents/:id", async (req, res) => {
  try {
    const { id } = req.params
    const content = await prisma.content.findUnique({
      where: {
        id: parseInt(id),
      },
    })

    if (!content) {
      res.status(404).json({ error: "Content not found" })
      return
    }

    res.status(200).json(content)
  } catch (error) {
    console.error("Error fetching content:", error)
    res.status(500).json({ error: "Internal server error." })
  }
})

// Create content
app.post("/api/contents", async (req, res) => {
  try {
    const {
      title,
      description,
      body,
      category,
      imageUrl,
      publishedDate,
      featured,
      slug,
    } = req.body

    if (!title || !description || !body || !category || !slug) {
      res.status(400).json({ error: "Required fields missing" })
      return
    }

    // Check if slug is unique
    const existingContent = await prisma.content.findUnique({
      where: { slug },
    })

    if (existingContent) {
      res.status(400).json({ error: "Slug must be unique" })
      return
    }

    const newContent = await prisma.content.create({
      data: {
        title,
        description,
        body,
        category,
        imageUrl: imageUrl || null,
        publishedDate: publishedDate || new Date().toISOString(),
        featured: featured || false,
        slug,
      },
    })

    res.status(201).json(newContent)
  } catch (error) {
    console.error("Error creating content:", error)
    res.status(500).json({ error: "Internal server error." })
  }
})

// Update content
app.put("/api/contents/:id", async (req, res) => {
  try {
    const { id } = req.params
    const {
      title,
      description,
      body,
      category,
      imageUrl,
      publishedDate,
      featured,
      slug,
    } = req.body

    if (!title || !description || !body || !category || !slug) {
      res.status(400).json({ error: "Required fields missing" })
      return
    }

    // Check if slug is unique (excluding current content)
    const existingContent = await prisma.content.findFirst({
      where: {
        slug,
        id: {
          not: parseInt(id),
        },
      },
    })

    if (existingContent) {
      res.status(400).json({ error: "Slug must be unique" })
      return
    }

    const updatedContent = await prisma.content.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        description,
        body,
        category,
        imageUrl: imageUrl || null,
        publishedDate: publishedDate || new Date().toISOString(),
        featured: featured !== undefined ? featured : false,
        slug,
      },
    })

    res.status(200).json(updatedContent)
  } catch (error) {
    console.error("Error updating content:", error)
    res.status(500).json({ error: "Internal server error." })
  }
})

// Delete content
app.delete("/api/contents/:id", async (req, res) => {
  try {
    const { id } = req.params

    await prisma.content.delete({
      where: {
        id: parseInt(id),
      },
    })

    res.status(200).json({ message: "Content deleted successfully" })
  } catch (error) {
    console.error("Error deleting content:", error)
    res.status(500).json({ error: "Internal server error." })
  }
})

// ==================== BOOKS ENDPOINTS ====================

// Get all books
app.get("/api/books", async (req, res) => {
  try {
    const books = await prisma.books.findMany()
    res.status(200).json(books)
  } catch (error) {
    console.error("Error fetching books:", error)
    res.status(500).json({ error: "Internal server error." })
  }
})

// Get book by ID
app.get("/api/books/:id", async (req, res) => {
  try {
    const { id } = req.params
    const book = await prisma.books.findUnique({
      where: {
        id,
      },
    })

    if (!book) {
      res.status(404).json({ error: "Book not found" })
      return
    }

    res.status(200).json(book)
  } catch (error) {
    console.error("Error fetching book:", error)
    res.status(500).json({ error: "Internal server error." })
  }
})

// Create book
app.post("/api/books", async (req, res) => {
  try {
    const { title, description, imageURL, buyLink } = req.body

    if (!title || !description || !buyLink) {
      res.status(400).json({ error: "Required fields missing" })
      return
    }

    const newBook = await prisma.books.create({
      data: {
        title,
        description,
        imageURL: imageURL || "",
        buyLink,
      },
    })

    res.status(201).json(newBook)
  } catch (error) {
    console.error("Error creating book:", error)
    res.status(500).json({ error: "Internal server error." })
  }
})

// Update book
app.put("/api/books/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, imageURL, buyLink } = req.body

    if (!title || !description || !buyLink) {
      res.status(400).json({ error: "Required fields missing" })
      return
    }

    const updatedBook = await prisma.books.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        imageURL: imageURL || "",
        buyLink,
      },
    })

    res.status(200).json(updatedBook)
  } catch (error) {
    console.error("Error updating book:", error)
    res.status(500).json({ error: "Internal server error." })
  }
})

// Delete book
app.delete("/api/books/:id", async (req, res) => {
  try {
    const { id } = req.params

    await prisma.books.delete({
      where: {
        id,
      },
    })

    res.status(200).json({ message: "Book deleted successfully" })
  } catch (error) {
    console.error("Error deleting book:", error)
    res.status(500).json({ error: "Internal server error." })
  }
})

// ==================== ADMIN ENDPOINTS ====================

// Admin login
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(403).json({ message: "All fields are required" })
      return
    }

    const admin = await prisma.admin.findFirst({
      where: {
        email,
        password,
      },
    })

    if (!admin) {
      res.status(403).json({ message: "Invalid Credentials" })
      return
    }

    res.status(200).json({ message: "Logged In successfully" })
  } catch (error) {
    console.log("Error in LOGIN !!!", error)
    res.status(500).json({ error: "Internal server error." })
  }
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
