import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"

const faqs = [
  {
    question: "What services does Innovative Solutions Inc. offer?",
    answer: "We offer a wide range of technology solutions including AI development, cloud services, cybersecurity, and data analytics."
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach our customer support team via email at support@innovativesolutions.com or by phone at 1-800-123-4567."
  },
  {
    question: "Do you offer custom solutions for businesses?",
    answer: "Yes, we specialize in creating custom solutions tailored to the unique needs of each business. Contact our sales team for more information."
  },
  {
    question: "What are your operating hours?",
    answer: "Our customer support team is available 24/7. Our office hours for general inquiries are Monday to Friday, 9 AM to 5 PM EST."
  },
  {
    question: "Do you offer training for your products?",
    answer: "Yes, we offer comprehensive training programs for all our products and services. These can be conducted online or in-person depending on your preference."
  },
  {
    question: "What is your refund policy?",
    answer: "We offer a 30-day money-back guarantee on most of our products. For custom solutions, refund policies are outlined in the individual contracts."
  },
  {
    question: "How do you ensure data security?",
    answer: "We employ state-of-the-art security measures including encryption, regular security audits, and strict access controls to ensure the safety of your data."
  },
  {
    question: "Can I upgrade my current plan?",
    answer: "Yes, you can upgrade your plan at any time. Contact our sales team for assistance with upgrading your services."
  }
]

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Search FAQs</CardTitle>
          <CardDescription>Find answers to your questions quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>FAQs</CardTitle>
          <CardDescription>Common questions about our services</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}

export default FAQPage;
