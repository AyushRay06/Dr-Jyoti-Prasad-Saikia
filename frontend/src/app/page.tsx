import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Award, Mail, Twitter, Instagram } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen  px-10 py-10">
      {/* Hero Section */}
      <section className="w-full mx-auto max-w-[1500px] py-12 md:py-24 lg:py-32 px-12 md:px-24 lg:px-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Dr. Jyoti Prasad Saikia
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Founder Vice-Chancellor, Birangana Sati Sadhani Rajyik
                  Vishwavidyalaya, Assam Renowned Bilingual Writer | Novelist |
                  Poet | Playwright
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button>
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Me
                </Button>
                <Button variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  View My Books
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                alt="Author Portrait"
                className="rounded-full object-cover"
                height={400}
                width={400}
                src="/author.jpeg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Biography Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 mx-auto max-w-[1000px]">
        <div className="container px-4 md:px-6">
          <div className=" space-y-12">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                About{"   "}
                <span className="font-light">Dr. Jyoti Prasad Saikia</span>
              </h2>
              <p className="text-muted-foreground md:text-xl">
                The journey that shaped my writing career
              </p>
            </div>
            <div className="space-y-6 text-lg">
              <p>
                Dr. Jyoti Prasad Saikia, a prolific bilingual writer from
                Sivasagar, Assam, has made significant contributions to Assamese
                literature and academia. With a literary journey spanning over
                four decades, he has penned more than 400 short stories, 16
                novels, 36 plays, 200 poems, 250 lyrics, and 215 television
                scripts, along with over 1,200 articles. His storytelling, rich
                in emotional depth and psychological exploration, delves into
                themes of human emotions, social dilemmas, and existential
                meaning.
              </p>
              <p>
                Apart from his literary prowess, Dr. Saikia is an esteemed
                academician with over 60 books on gender studies and sociology
                published in both English and Assamese. His narratives follow an
                unconventional style, drawing readers into immersive experiences
                that forge deep connections with characters and their struggles.
              </p>
              <p>
                Currently serving as the Founder Vice-Chancellor of Birangana
                Sati Sadhani Rajyik Vishwavidyalaya, Assam, Dr. Saikia continues
                to inspire generations through his writing, research, and
                academic contributions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
