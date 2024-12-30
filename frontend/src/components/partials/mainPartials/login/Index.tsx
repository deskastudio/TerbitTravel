import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { loginSchema, LoginFormValues } from "@/lib/schemas";

const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast({
      title: "Login Successful",
      description: `Welcome back, ${data.email}`,
    });
    console.log(data);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-[#6B7280]">
            Log In
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#6B7280] font-medium">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email" 
                        {...field}
                        className="
                          bg-white
                          border-gray-200
                          focus:border-[#B17457]
                          focus:ring-[#B17457]/10
                          text-gray-800
                          placeholder-gray-400
                          rounded-xl"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#6B7280] font-medium">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        className="
                          bg-white
                          border-gray-200
                          focus:border-[#B17457]
                          focus:ring-[#B17457]/10
                          text-gray-800
                          placeholder-gray-400
                          rounded-xl"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="
                  w-full 
                  bg-gradient-to-r from-[#B17457] to-blue-600
                  hover:opacity-90
                  text-white 
                  transition-opacity 
                  duration-200
                  rounded-xl
                  py-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center space-y-2">
            <p className="text-[#6B7280]">
              Don't have an account?{" "}
              <a 
                href="/register" 
                className="text-blue-600 hover:text-blue-700"
              >
                Sign up
              </a>
            </p>
            <a 
              href="/forgot-password" 
              className="text-[#B17457] hover:text-[#B17457]/80 block"
            >
              Forgot password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;