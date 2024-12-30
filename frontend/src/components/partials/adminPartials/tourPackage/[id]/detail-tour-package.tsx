// import { useNavigate } from "react-router-dom";
// import { 
//   MapPin, Calendar, Clock, Users, Utensils, Car, Hotel, CheckCircle, XCircle 
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";

// // Data Mock untuk contoh
// const mockTourPackage = {
//   id: "1",
//   name: "Bali Adventure",
//   description:
//     "Explore the beautiful island of Bali with our exclusive tour package. Experience the rich culture, stunning beaches, and lush landscapes of this tropical paradise.",
//   includes: [
//     "Hotel accommodation",
//     "Daily breakfast",
//     "Airport transfer",
//     "Guided tours",
//     "Entrance fees",
//   ],
//   excludes: ["Flights", "Personal expenses", "Travel insurance", "Additional meals"],
//   price: 1000000,
//   duration: "3 days",
//   schedules: [
//     { startDate: "2023-08-01", endDate: "2023-08-03" },
//     { startDate: "2023-09-15", endDate: "2023-09-17" },
//     { startDate: "2023-10-10", endDate: "2023-10-12" },
//   ],
//   destination: "Bali",
//   hotel: "Bali Resort & Spa",
//   fleet: "Luxury Minibus",
//   consume: "Breakfast",
//   status: "available",
//   maxParticipants: 15,
//   imageUrl: "/placeholder.jpg",
// };

// const TourPackageDetailPage = ({ id }: { id: string }) => {
//   const navigate = useNavigate();

//   // Data Mock, di aplikasi nyata, data ini diambil dari API
//   const tourPackage = mockTourPackage;

//   if (!tourPackage) {
//     return <div>Paket tidak ditemukan</div>;
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
//         <img
//           src={tourPackage.imageUrl}
//           alt={tourPackage.name}
//           className="object-cover w-full h-full"
//         />
//         <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
//           <div className="p-8">
//             <h1 className="text-4xl font-bold text-white mb-2">{tourPackage.name}</h1>
//             <div className="flex items-center text-white">
//               <MapPin className="w-5 h-5 mr-2" />
//               <span>{tourPackage.destination}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid gap-8 md:grid-cols-3">
//         <div className="md:col-span-2 space-y-8">
//           {/* Detail Paket */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Detail Paket</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <p>{tourPackage.description}</p>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="flex items-center">
//                   <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
//                   <span>
//                     <strong>Durasi:</strong> {tourPackage.duration}
//                   </span>
//                 </div>
//                 <div className="flex items-center">
//                   <Users className="w-5 h-5 mr-2 text-muted-foreground" />
//                   <span>
//                     <strong>Maks. Peserta:</strong> {tourPackage.maxParticipants}
//                   </span>
//                 </div>
//                 <div className="flex items-center">
//                   <Hotel className="w-5 h-5 mr-2 text-muted-foreground" />
//                   <span>
//                     <strong>Hotel:</strong> {tourPackage.hotel}
//                   </span>
//                 </div>
//                 <div className="flex items-center">
//                   <Car className="w-5 h-5 mr-2 text-muted-foreground" />
//                   <span>
//                     <strong>Transportasi:</strong> {tourPackage.fleet}
//                   </span>
//                 </div>
//                 <div className="flex items-center">
//                   <Utensils className="w-5 h-5 mr-2 text-muted-foreground" />
//                   <span>
//                     <strong>Konsumsi:</strong> {tourPackage.consume}
//                   </span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Termasuk dan Tidak Termasuk */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Termasuk & Tidak Termasuk</CardTitle>
//             </CardHeader>
//             <CardContent className="grid md:grid-cols-2 gap-6">
//               <div>
//                 <h3 className="font-semibold mb-2 flex items-center">
//                   <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
//                   Termasuk:
//                 </h3>
//                 <ul className="space-y-1">
//                   {tourPackage.includes.map((item, index) => (
//                     <li key={index} className="flex items-center">
//                       <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
//                       {item}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div>
//                 <h3 className="font-semibold mb-2 flex items-center">
//                   <XCircle className="w-5 h-5 mr-2 text-red-500" />
//                   Tidak Termasuk:
//                 </h3>
//                 <ul className="space-y-1">
//                   {tourPackage.excludes.map((item, index) => (
//                     <li key={index} className="flex items-center">
//                       <XCircle className="w-4 h-4 mr-2 text-red-500" />
//                       {item}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Jadwal */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Jadwal Tersedia</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                 {tourPackage.schedules.map((schedule, index) => (
//                   <div key={index} className="bg-muted p-4 rounded-lg">
//                     <div className="flex items-center mb-2">
//                       <Calendar className="w-5 h-5 mr-2 text-muted-foreground" />
//                       <span className="font-semibold">Perjalanan {index + 1}</span>
//                     </div>
//                     <div className="text-sm">
//                       {schedule.startDate} - {schedule.endDate}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Informasi Pemesanan */}
//         <div className="space-y-8">
//           <Card>
//             <CardHeader>
//               <CardTitle>Informasi Pemesanan</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="text-3xl font-bold">
//                 {tourPackage.price.toLocaleString("id-ID", {
//                   style: "currency",
//                   currency: "IDR",
//                 })}
//               </div>
//               <Badge
//                 variant={
//                   tourPackage.status === "available" ? "success" : "secondary"
//                 }
//               >
//                 {tourPackage.status}
//               </Badge>
//               <Separator />
//               <Button className="w-full">Pesan Sekarang</Button>
//               <p className="text-sm text-muted-foreground text-center">
//                 atau hubungi kami di +62 123 456 7890
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Butuh Bantuan?</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2">
//               <p className="text-sm">
//                 Tim ahli perjalanan kami siap membantu Anda dengan pertanyaan
//                 atau permintaan khusus.
//               </p>
//               <Button variant="outline" className="w-full">
//                 Hubungi Kami
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <div className="mt-8 flex justify-between items-center">
//         <Button variant="outline" onClick={() => navigate("/tour-packages")}>
//           Kembali ke Semua Paket
//         </Button>
//         <Button onClick={() => navigate(`/tour-packages/${tourPackage.id}/edit`)}>
//           Edit Paket
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default TourPackageDetailPage;
