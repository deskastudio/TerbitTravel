'use client'

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const TeamSection = () => {
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

export default TeamSection;
