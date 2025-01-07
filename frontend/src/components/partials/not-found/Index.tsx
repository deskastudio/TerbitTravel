// import { useState, useEffect, useCallback } from "react";
// import { motion, useAnimationControls } from "framer-motion";
// import { Home, ArrowLeft } from "lucide-react"; // Ikon Lucide untuk tombol
// import { Button } from "@/components/ui/button"; // Pastikan sudah mengimpor Button dari ShadCN

// const NotFoundPage: React.FC = () => {
//   const [displayedText, setDisplayedText] = useState("");
//   const fullText = "Halaman Tidak Ditemukan";
//   const controls = useAnimationControls();

//   // Memisahkan animasi gradient ke dalam useCallback
//   const startGradientAnimation = useCallback(() => {
//     controls.start({
//       backgroundPosition: ["0%", "100%", "0%"],
//       transition: {
//         duration: 8,
//         repeat: Infinity,
//         ease: "linear",
//       },
//     });
//   }, [controls]);

//   useEffect(() => {
//     let currentIndex = 0;
//     const interval = setInterval(() => {
//       if (currentIndex <= fullText.length) {
//         setDisplayedText(fullText.slice(0, currentIndex));
//         currentIndex++;
//       } else {
//         clearInterval(interval);
//         startGradientAnimation();
//       }
//     }, 100); // Adjust typing speed here

//     return () => clearInterval(interval);
//   }, [fullText, startGradientAnimation]);

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.3,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.8,
//         ease: "easeOut",
//       },
//     },
//   };

//   const imageVariants = {
//     hidden: { opacity: 0, x: 100 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: {
//         duration: 0.8,
//         ease: "easeOut",
//       },
//     },
//   };

//   const decorationVariants = {
//     hidden: { scale: 0, opacity: 0 },
//     visible: {
//       scale: 1,
//       opacity: 0.3,
//       transition: {
//         duration: 1.5,
//         ease: "easeOut",
//       },
//     },
//   };

//   const handleBackClick = () => {
//     window.history.back(); // Kembali ke halaman sebelumnya
//   };

//   const handleHomeClick = () => {
//     window.location.href = "/"; // Redirect ke halaman utama
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center">
//       <motion.div
//         className="container mx-auto pt-28 pb-10 px-5 relative z-10 w-full"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
//           {/* Text Section */}
//           <motion.div className="text-center lg:text-left z-20" variants={itemVariants}>
//             <motion.h1 className="text-3xl lg:text-6xl font-bold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-900 via-red-500 to-yellow-500 inline-block" variants={itemVariants}>
//               {displayedText}
//             </motion.h1>
//             <motion.p className="text-gray-700 text-lg lg:text-xl max-w-lg mx-auto lg:mx-0" variants={itemVariants}>
//               Maaf, halaman yang Anda cari tidak ditemukan. Berikut beberapa tautan yang dapat membantu:
//             </motion.p>

//             <motion.div className="md:py-10 py-4" variants={itemVariants}>
//               <Button
//                 variant="outline"
//                 onClick={handleBackClick}
//                 className="mt-4 px-8 py-3 border border-amber-700 text-amber-700 hover:bg-[#B17457]/10 font-semibold rounded-lg shadow-lg transition-all duration-300"
//               >
//                 <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
//                 Kembali
//               </Button>

//               <Button
//                 onClick={handleHomeClick}
//                 className="mt-4 ml-4 px-8 py-3 bg-amber-700 text-white hover:bg-amber-800 font-semibold rounded-lg shadow-lg transition-all duration-300"
//               >
//                 <Home className="w-5 h-5" />
//                 Ke Beranda
//               </Button>
//             </motion.div>
//           </motion.div>

//           {/* Image Section */}
//           <motion.div className="relative mt-8 lg:mt-0 w-full max-w-[600px]" variants={imageVariants}>
//             <motion.img
//               src="../Beranda/terbit.png"
//               alt="Halaman Tidak Ditemukan"
//               className="w-full max-w-[600px] h-auto object-contain"
//               whileHover={{ scale: 1.05 }}
//               transition={{ duration: 0.3 }}
//             />
//           </motion.div>
//         </div>
//       </motion.div>

//       {/* Decorative Background Elements */}
//       <div className="absolute inset-0">
//         <motion.div
//           className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-xl"
//           variants={decorationVariants}
//           initial="hidden"
//           animate="visible"
//           transition={{ delay: 0.5 }}
//         />
//         <motion.div
//           className="absolute bottom-10 right-10 w-48 h-48 bg-pink-400 rounded-full blur-xl"
//           variants={decorationVariants}
//           initial="hidden"
//           animate="visible"
//           transition={{ delay: 0.7 }}
//         />
//         <motion.div
//           className="absolute bottom-20 left-40 w-24 h-24 bg-blue-400 rounded-full blur-xl"
//           variants={decorationVariants}
//           initial="hidden"
//           animate="visible"
//           transition={{ delay: 0.9 }}
//         />
//       </div>
//     </div>
//   );
// };

// export default NotFoundPage;
