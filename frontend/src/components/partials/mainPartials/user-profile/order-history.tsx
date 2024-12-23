import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Badge } from "@/components/ui/badge"
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  
  const orders = [
    { id: "ORD001", date: "2023-05-01", total: 125.99, status: "Delivered" },
    { id: "ORD002", date: "2023-05-15", total: 79.99, status: "Shipped" },
    { id: "ORD003", date: "2023-06-02", total: 249.99, status: "Processing" },
    { id: "ORD004", date: "2023-06-18", total: 99.99, status: "Cancelled" },
  ]
  
  const OrderHistory = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Order History</h2>
        <div className="hidden md:block">
          <Table>
            <TableCaption>A list of your recent orders</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === "Delivered" ? "default" : 
                                   order.status === "Shipped" ? "secondary" :
                                   order.status === "Processing" ? "outline" : "destructive"}>
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="md:hidden space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle>{order.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Date: {order.date}</p>
                <p>Total: ${order.total.toFixed(2)}</p>
                <Badge variant={order.status === "Delivered" ? "default" : 
                               order.status === "Shipped" ? "secondary" :
                               order.status === "Processing" ? "outline" : "destructive"}>
                  {order.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  export default OrderHistory;
  
  