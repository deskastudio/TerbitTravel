// // src/app/auth/register/page.tsx
// import * as React from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { GoogleLogin } from '@react-oauth/google';
// import { useNavigate } from 'react-router-dom';
// import { Eye, EyeOff, Loader2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//  Form,
//  FormControl,
//  FormField,
//  FormItem,
//  FormLabel,
//  FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { toast } from "@/hooks/use-toast";
// import { registerSchema } from '@/schemas/auth.schema';
// import { authService } from '@/services/auth.service';

// const RegisterPage = () => {
//  const navigate = useNavigate();
//  const [isLoading, setIsLoading] = React.useState(false);
//  const [showPassword, setShowPassword] = React.useState(false);
//  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

//  const form = useForm({
//    resolver: zodResolver(registerSchema),
//    defaultValues: {
//      name: "",
//      email: "",
//      password: "",
//      confirmPassword: "",
//    },
//  });

//  const onSubmit = async (values) => {
//    try {
//      setIsLoading(true);
//      await authService.register(values);
//      toast({
//        title: "Success",
//        description: "Account created successfully",
//      });
//      navigate('/login');
//    } catch (error) {
//      toast({
//        title: "Error",
//        description: error.message,
//        variant: "destructive",
//      });
//    } finally {
//      setIsLoading(false);
//    }
//  };

//  const handleGoogleSuccess = async (response) => {
//    try {
//      setIsLoading(true);
//      await authService.googleAuth(response.credential);
//      toast({
//        title: "Success",
//        description: "Logged in with Google successfully",
//      });
//      navigate('/dashboard');
//    } catch (error) {
//      toast({
//        title: "Error",
//        description: error.message,
//        variant: "destructive",
//      });
//    } finally {
//      setIsLoading(false);
//    }
//  };

//  return (
//    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//      <div className="w-full max-w-md">
//        <div className="bg-white rounded-3xl shadow-xl p-8">
//          <h1 className="text-4xl font-bold text-center mb-8">Sign Up</h1>
         
//          <Form {...form}>
//            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//              <FormField
//                control={form.control}
//                name="name"
//                render={({ field }) => (
//                  <FormItem>
//                    <FormLabel>Name</FormLabel>
//                    <FormControl>
//                      <Input 
//                        placeholder="Enter your name"
//                        {...field}
//                        className="rounded-xl"
//                      />
//                    </FormControl>
//                    <FormMessage />
//                  </FormItem>
//                )}
//              />

//              <FormField
//                control={form.control}
//                name="email"
//                render={({ field }) => (
//                  <FormItem>
//                    <FormLabel>Email</FormLabel>
//                    <FormControl>
//                      <Input 
//                        placeholder="Enter your email"
//                        type="email"
//                        {...field}
//                        className="rounded-xl"
//                      />
//                    </FormControl>
//                    <FormMessage />
//                  </FormItem>
//                )}
//              />

//              <FormField
//                control={form.control}
//                name="password"
//                render={({ field }) => (
//                  <FormItem>
//                    <FormLabel>Password</FormLabel>
//                    <FormControl>
//                      <div className="relative">
//                        <Input
//                          type={showPassword ? "text" : "password"}
//                          placeholder="Enter your password"
//                          {...field}
//                          className="rounded-xl"
//                        />
//                        <Button
//                          type="button"
//                          variant="ghost"
//                          size="sm"
//                          className="absolute right-0 top-0 h-full"
//                          onClick={() => setShowPassword(!showPassword)}
//                        >
//                          {showPassword ? (
//                            <EyeOff className="h-4 w-4" />
//                          ) : (
//                            <Eye className="h-4 w-4" />
//                          )}
//                        </Button>
//                      </div>
//                    </FormControl>
//                    <FormMessage />
//                  </FormItem>
//                )}
//              />

//              <FormField
//                control={form.control}
//                name="confirmPassword" 
//                render={({ field }) => (
//                  <FormItem>
//                    <FormLabel>Confirm Password</FormLabel>
//                    <FormControl>
//                      <div className="relative">
//                        <Input
//                          type={showConfirmPassword ? "text" : "password"}
//                          placeholder="Confirm your password"
//                          {...field}
//                          className="rounded-xl"
//                        />
//                        <Button
//                          type="button"
//                          variant="ghost"
//                          size="sm"
//                          className="absolute right-0 top-0 h-full"
//                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                        >
//                          {showConfirmPassword ? (
//                            <EyeOff className="h-4 w-4" />
//                          ) : (
//                            <Eye className="h-4 w-4" />
//                          )}
//                        </Button>
//                      </div>
//                    </FormControl>
//                    <FormMessage />
//                  </FormItem>
//                )}
//              />

//              <Button
//                type="submit"
//                className="w-full rounded-xl"
//                disabled={isLoading}
//              >
//                {isLoading ? (
//                  <>
//                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                    Please wait
//                  </>
//                ) : (
//                  "Sign Up"
//                )}
//              </Button>
//            </form>
//          </Form>

//          <div className="relative my-4">
//            <div className="absolute inset-0 flex items-center">
//              <span className="w-full border-t" />
//            </div>
//            <div className="relative flex justify-center text-xs uppercase">
//              <span className="bg-white px-2 text-muted-foreground">
//                Or continue with
//              </span>
//            </div>
//          </div>

//          <GoogleLogin
//            onSuccess={handleGoogleSuccess}
//            onError={() => {
//              toast({
//                title: "Error",
//                description: "Google sign up failed",
//                variant: "destructive",
//              });
//            }}
//          />

//          <p className="mt-6 text-center text-sm text-muted-foreground">
//            Already have an account?{" "}
//            <Link
//              to="/login"
//              className="text-primary hover:underline"
//            >
//              Log in
//            </Link>
//          </p>
//        </div>
//      </div>
//    </div>
//  );
// };

// export default RegisterPage;