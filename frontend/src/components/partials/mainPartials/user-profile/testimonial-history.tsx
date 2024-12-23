import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StarIcon } from 'lucide-react'

const testimonials = [
  { id: 1, product: "Wireless Headphones", rating: 5, comment: "Great sound quality and comfortable to wear!", date: "2023-05-10" },
  { id: 2, product: "Smart Watch", rating: 4, comment: "Good features, but battery life could be better.", date: "2023-06-15" },
  { id: 3, product: "Laptop", rating: 5, comment: "Excellent performance and sleek design!", date: "2023-07-01" },
]

const TestimonialHistory= () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Testimonials</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader>
              <CardTitle>{testimonial.product}</CardTitle>
              <CardDescription>Posted on {testimonial.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-1 mb-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon
                    key={index}
                    className={`h-5 w-5 ${
                      index < testimonial.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                  />
                ))}
              </div>
              <p>{testimonial.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default TestimonialHistory;

