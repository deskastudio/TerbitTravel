import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const PrivacyPolicyPage = () => {
  const [selectedTab, setSelectedTab] = useState("collection");

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      
      <Tabs defaultValue="collection" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="collection" onClick={() => setSelectedTab("collection")}>Data Collection</TabsTrigger>
          <TabsTrigger value="use" onClick={() => setSelectedTab("use")}>Data Use</TabsTrigger>
          <TabsTrigger value="protection" onClick={() => setSelectedTab("protection")}>Data Protection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="collection" className={selectedTab === "collection" ? "block" : "hidden"}>
          <Card>
            <CardHeader>
              <CardTitle>Data Collection</CardTitle>
              <CardDescription>Information we collect from you</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal information (name, email, phone number)</li>
                <li>Usage data (how you interact with our services)</li>
                <li>Device information (IP address, browser type)</li>
                <li>Cookies and similar technologies</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="use" className={selectedTab === "use" ? "block" : "hidden"}>
          <Card>
            <CardHeader>
              <CardTitle>Data Use</CardTitle>
              <CardDescription>How we use your information</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To notify you about changes to our services</li>
                <li>To allow you to participate in interactive features</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protection" className={selectedTab === "protection" ? "block" : "hidden"}>
          <Card>
            <CardHeader>
              <CardTitle>Data Protection</CardTitle>
              <CardDescription>How we protect your information</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use of secure protocols (HTTPS)</li>
                <li>Regular security audits</li>
                <li>Employee training on data protection</li>
                <li>Limited access to personal information</li>
                <li>Use of encryption for sensitive data</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PrivacyPolicyPage;
