import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const TermsConditionsPage: React.FC = () => {
  // State type is a string or null, depending on the expanded item
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  // Function to toggle accordion item
  const handleAccordionToggle = (value: string): void => {
    setExpandedItem(expandedItem === value ? null : value) // Toggle item open/close
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Terms & Conditions</h1>
      <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      
      <Card>
        <CardHeader>
          <CardTitle>Agreement to Terms</CardTitle>
          <CardDescription>Please read these terms carefully before using our services</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger onClick={() => handleAccordionToggle("item-1")}>1. Acceptance of Terms</AccordionTrigger>
              {expandedItem === "item-1" && (
                <AccordionContent>
                  By accessing or using our services, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.
                </AccordionContent>
              )}
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger onClick={() => handleAccordionToggle("item-2")}>2. Use License</AccordionTrigger>
              {expandedItem === "item-2" && (
                <AccordionContent>
                  Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                </AccordionContent>
              )}
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger onClick={() => handleAccordionToggle("item-3")}>3. Disclaimer</AccordionTrigger>
              {expandedItem === "item-3" && (
                <AccordionContent>
                  The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </AccordionContent>
              )}
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger onClick={() => handleAccordionToggle("item-4")}>4. Limitations</AccordionTrigger>
              {expandedItem === "item-4" && (
                <AccordionContent>
                  In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage.
                </AccordionContent>
              )}
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger onClick={() => handleAccordionToggle("item-5")}>5. Revisions and Errata</AccordionTrigger>
              {expandedItem === "item-5" && (
                <AccordionContent>
                  The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete or current. We may make changes to the materials contained on its website at any time without notice.
                </AccordionContent>
              )}
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}

export default TermsConditionsPage
