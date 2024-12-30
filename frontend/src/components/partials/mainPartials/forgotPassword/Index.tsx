import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

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
import { forgotPasswordSchema, ForgotPasswordFormValues } from "@/lib/schemas";

const ForgotPasswordForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(data);
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-[#6B7280]">
            Forgot Password
          </h1>
          
          {!isSubmitted ? (
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
                <Button 
                  type="submit" 
                  className="
                    w-full 
                    bg-gradient-to-r from-[#B17457] to-blue-600
                    hover:opacity-90
                    text-white 
                    transition-opacity 
                    duration-200
                    rounded-xl
                    py-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-8"
            >
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 mx-auto text-[#B17457]" />
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-[#6B7280]">
                Check your email
              </h2>
              <p className="text-gray-500 mb-8">
                We've sent a password reset link to your email address.
              </p>
            </motion.div>
          )}

          <div className="mt-6 text-center space-y-4">
            <p className="text-[#6B7280]">
              Remember your password?
            </p>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 inline-flex items-center justify-center gap-2 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;