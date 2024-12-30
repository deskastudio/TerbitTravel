'use client'  
import { motion } from 'framer-motion' 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Linkedin, Twitter, Mail } from 'lucide-react'
import { TEAM_MEMBERS } from '@/lib/constants'

interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  email?: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  social: SocialLinks;
}

const TeamSection = () => {
  return (
    <section className="py-10">
      <h2 className="text-4xl font-bold mb-8 text-center">Tim Travedia</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {TEAM_MEMBERS.map((member: TeamMember, index: number) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 * index }}
          >
            <Card>
              <CardHeader>
                <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto" />
                <CardTitle className="text-center">{member.name}</CardTitle>
                <CardDescription className="text-center font-medium text-gray-500 mb-4">
                  {member.role}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center">{member.bio}</p>
                <div className="flex justify-center space-x-4">
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-6 h-6 text-gray-600 hover:text-blue-500 transition" />  
                    </a>
                  )}
                  {member.social.twitter && (
                    <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="w-6 h-6 text-gray-600 hover:text-blue-400 transition" />
                    </a>  
                  )}
                  {member.social.email && (
                    <a href={`mailto:${member.social.email}`}>
                      <Mail className="w-6 h-6 text-gray-600 hover:text-green-500 transition" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;