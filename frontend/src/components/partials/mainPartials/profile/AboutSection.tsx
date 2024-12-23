"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const aboutContent = [
  {
    title: "Our Story",
    content: "Founded in 2010, Innovative Solutions Inc. has been at the forefront of technological advancements. Our journey began with a simple idea: to make complex technology accessible to everyone. Today, we're proud to be industry leaders, constantly pushing the boundaries of what's possible.",
    image: "/path/to/your-image1.jpg",
  },
  {
    title: "Our Mission",
    content: "Our mission is to empower businesses and individuals through innovative technology solutions. We strive to create products and services that not only meet the current needs of our clients but anticipate future challenges and opportunities.",
    image: "/path/to/your-image2.jpg",
  },
  {
    title: "Our Values",
    content: "At Innovative Solutions Inc., we're guided by our core values: Innovation, Integrity, Collaboration, and Excellence. These principles shape every decision we make and every product we develop, ensuring that we always deliver the highest quality solutions to our clients.",
    image: "/path/to/your-image3.jpg",
  },
]

const AboutSection = () => {
  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">About Us</h2>
        <Tabs defaultValue="story" className="w-full">
          <TabsList className="flex justify-center space-x-4 w-full mb-8 bg-transparent">
            <TabsTrigger value="story" className="py-2 px-4 text-lg font-semibold hover:bg-primary hover:text-white rounded-lg">
              Our Story
            </TabsTrigger>
            <TabsTrigger value="mission" className="py-2 px-4 text-lg font-semibold hover:bg-primary hover:text-white rounded-lg">
              Our Mission
            </TabsTrigger>
            <TabsTrigger value="values" className="py-2 px-4 text-lg font-semibold hover:bg-primary hover:text-white rounded-lg">
              Our Values
            </TabsTrigger>
          </TabsList>
          {aboutContent.map((item, index) => (
            <TabsContent key={index} value={item.title.toLowerCase().split(' ')[1]}>
              <Card className="flex flex-col md:flex-row items-center md:items-start mb-8 p-4 bg-white shadow-lg rounded-lg">
                <div className="w-full md:w-1/3 p-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
                <div className="w-full md:w-2/3 p-4">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.content}</CardDescription>
                  </CardContent>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

export default AboutSection;
