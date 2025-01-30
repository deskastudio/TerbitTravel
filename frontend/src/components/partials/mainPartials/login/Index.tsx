// // src/app/auth/login/page.tsx
// import * as React from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { GoogleLogin } from '@react-oauth/google';
// import { Link, useNavigate } from 'react-router-dom';
// import { Loader2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { toast } from "@/hooks/use-toast";
// import { loginSchema } from '@/schemas/auth.schema';
// import { authService } from '@/services/auth.service';

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = React.useState(false);

//   const form = useForm({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (values) => {
//     try {
//       setIsLoading(true);
//       await authService.login(values);
//       toast({
//         title: "Success",
//         description: "Logged in successfully",
//       });
//       navigate('/dashboard');
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleSuccess = async (response) => {
//     try {
//       setIsLoading(true);
//       await authService.googleAuth(response.credential);
//       toast({
//         title: "Success",
//         description: "Logged in with Google successfully",
//       });
//       navigate('/dashboard');
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white rounded-3xl shadow-xl p-8">
//           <h1 className="text-4xl font-bold text-center mb-8">Log In</h1>

//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input 
//                         placeholder="Enter your email"
//                         type="email"
//                         {...field}
//                         className="rounded-xl"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="password"
//                         placeholder="Enter your password"
//                         {...field}
//                         className="rounded-xl"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Button
//                 type="submit"
//                 className="w-full rounded-xl"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Please wait
//                   </>
//                 ) : (
//                   "Log In"
//                 )}
//               </Button>
//             </form>
//           </Form>

//           <div className="relative my-4">
//             <div className="absolute inset-0 flex items-center">
//               <span className="w-full border-t" />
//             </div>
//             <div className="relative flex justify-center text-xs uppercase">
//               <span className="bg-white px-2 text-muted-foreground">
//                 Or continue with
//               </span>
//             </div>
//           </div>

//           <GoogleLogin
//             onSuccess={handleGoogleSuccess}
//             onError={() => {
//               toast({
//                 title: "Error",
//                 description: "Google login failed",
//                 variant: "destructive",
//               });
//             }}
//           />

//           <div className="mt-6 text-center space-y-2">
//             <p className="text-sm text-muted-foreground">
//               Don't have an account?{" "}
//               <Link
//                 to="/register"
//                 className="text-primary hover:underline"
//               >
//                 Sign up
//               </Link>
//             </p>
//             <Link
//               to="/forgot-password"
//               className="text-sm text-primary hover:underline"
//             >
//               Forgot password?
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;