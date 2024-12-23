'use client'

import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

const PartnersSection = () => {
  const partners = [
    { name: "Microsoft", logo: "/placeholder.svg?height=100&width=100" },
    { name: "AWS", logo: "/placeholder.svg?height=100&width=100" },
    { name: "Google Cloud", logo: "/placeholder.svg?height=100&width=100" },
    { name: "Salesforce", logo: "/placeholder.svg?height=100&width=100" },
  ]

  return (
    <section id="partners" className="py-16">
      <h2 className="text-4xl font-extrabold mb-12 text-center text-gray-800">Our Partners & Certifications</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {partners.map((partner, index) => (
          <motion.div
            key={partner.name}
            className="w-40"
            initial={{ opacity: 0, y: 50 }} // Start from opacity 0 and move up a little
            animate={{ opacity: 1, y: 0 }} // Animate to full opacity and reset the position
            transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }} // Add staggered delay for smooth sequence
          >
            <Card className="transition-transform transform hover:scale-105 hover:shadow-lg">
              <CardHeader className="text-center">
                <img src={partner.logo} alt={partner.name} width={80} height={80} className="mx-auto" />
              </CardHeader>
              <CardContent className="text-center">
                <p className="font-semibold text-gray-700">{partner.name}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default PartnersSection;
