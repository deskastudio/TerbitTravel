'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-6 px-4 md:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">TechNova</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#about" className="hover:underline">About</a></li>
            <li><a href="#services" className="hover:underline">Services</a></li>
            <li><a href="#gallery" className="hover:underline">Gallery</a></li>
            <li><a href="#partners" className="hover:underline">Partners</a></li>
            <li><a href="#team" className="hover:underline">Team</a></li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <HeroCarousel />
        <Separator className="my-12" />
        <AboutSection />
        <Separator className="my-12" />
        <ServicesSection />
        <Separator className="my-12" />
        <GallerySection />
        <Separator className="my-12" />
        <PartnersSection />
        <Separator className="my-12" />
        <TeamSection />
      </main>

      <footer className="bg-muted py-6 px-4 md:px-6 lg:px-8 text-center">
        <p>&copy; 2024 TechNova. All rights reserved.</p>
      </footer>
    </div>
  )
}

function HeroCarousel() {
  const slides = [
    { title: "Innovating for Tomorrow", description: "Transforming ideas into cutting-edge solutions", image: "/placeholder.svg?height=400&width=800" },
    { title: "Empowering Businesses", description: "Driving growth through technology", image: "/placeholder.svg?height=400&width=800" },
    { title: "Sustainable Solutions", description: "Creating a better future for all", image: "/placeholder.svg?height=400&width=800" },
  ]

  return (
    <Carousel className="w-full max-w-4xl mx-auto">
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <div className="relative h-[400px] w-full">
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover rounded-lg" />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white p-6 rounded-lg">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-center">{slide.title}</h2>
                <p className="text-xl md:text-2xl mb-8 text-center">{slide.description}</p>
                <Button size="lg" variant="outline">Learn More</Button>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

function AboutSection() {
  return (
    <section id="about" className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">About TechNova</h2>
      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
          <CardDescription>Empowering businesses through innovative technology</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            At TechNova, we're passionate about leveraging cutting-edge technology to solve complex business challenges. 
            Our team of experts is dedicated to creating tailored solutions that drive growth, efficiency, and success for our clients.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}

function ServicesSection() {
  return (
    <section id="services" className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Services</h2>
      <Tabs defaultValue="consulting" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="consulting">Consulting</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
          <TabsTrigger value="cloud">Cloud Solutions</TabsTrigger>
        </TabsList>
        <TabsContent value="consulting">
          <Card>
            <CardHeader>
              <CardTitle>IT Consulting</CardTitle>
              <CardDescription>Strategic technology planning and implementation</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Our expert consultants work closely with your team to identify opportunities, overcome challenges, and implement cutting-edge solutions that drive your business forward.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="development">
          <Card>
            <CardHeader>
              <CardTitle>Custom Software Development</CardTitle>
              <CardDescription>Tailored solutions for your unique needs</CardDescription>
            </CardHeader>
            <CardContent>
              <p>From web and mobile applications to enterprise software, our development team creates robust, scalable, and user-friendly solutions that help you achieve your business goals.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cloud">
          <Card>
            <CardHeader>
              <CardTitle>Cloud Solutions</CardTitle>
              <CardDescription>Secure, scalable, and efficient cloud infrastructure</CardDescription>
            </CardHeader>
            <CardContent>
              <p>We help businesses leverage the power of cloud computing to improve flexibility, reduce costs, and enhance collaboration across their organization.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}

function GallerySection() {
  const images = [
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
  ]

  return (
    <section id="gallery" className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Project Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((src, index) => (
          <div key={index} className="relative h-[300px] w-full">
            <img src={src} alt={`Project ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
          </div>
        ))}
      </div>
    </section>
  )
}

function PartnersSection() {
  const partners = [
    { name: "Microsoft", logo: "/placeholder.svg?height=100&width=100" },
    { name: "AWS", logo: "/placeholder.svg?height=100&width=100" },
    { name: "Google Cloud", logo: "/placeholder.svg?height=100&width=100" },
    { name: "Salesforce", logo: "/placeholder.svg?height=100&width=100" },
  ]

  return (
    <section id="partners" className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Partners & Certifications</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {partners.map((partner) => (
          <Card key={partner.name} className="w-40">
            <CardHeader className="text-center">
              <img src={partner.logo} alt={partner.name} width={80} height={80} className="mx-auto" />
            </CardHeader>
            <CardContent className="text-center">
              <p className="font-semibold">{partner.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

function TeamSection() {
  const teamMembers = [
    { name: "Alex Johnson", role: "CEO", image: "/placeholder.svg?height=100&width=100" },
    { name: "Sarah Lee", role: "CTO", image: "/placeholder.svg?height=100&width=100" },
    { name: "Michael Chen", role: "Lead Designer", image: "/placeholder.svg?height=100&width=100" },
  ]

  return (
    <section id="team" className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member) => (
          <Card key={member.name}>
            <CardHeader>
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full" />
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-center">{member.name}</CardTitle>
              <CardDescription className="text-center">{member.role}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
