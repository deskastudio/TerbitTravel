import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
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


const registerSchema = z.object({
  nama: z.string().min(1, "Nama tidak boleh kosong"),
  email: z.string().min(1, "Email tidak boleh kosong").email("Format email tidak valid"),
  password: z.string()
    .min(1, "Password tidak boleh kosong")
    .min(6, "Password minimal 6 karakter")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password harus mengandung huruf besar, huruf kecil, dan angka"
    ),
  confirmPassword: z.string().min(1, "Konfirmasi password tidak boleh kosong"),
  alamat: z.string().min(1, "Alamat tidak boleh kosong"),
  noTelp: z.string()
    .min(1, "Nomor telepon tidak boleh kosong")
    .regex(/^\+?[0-9]+$/, "Format nomor telepon tidak valid"),
  instansi: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { register: registerUser, googleRegister } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nama: "",
      email: "",
      password: "",
      confirmPassword: "",
      alamat: "",
      noTelp: "",
      instansi: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append('nama', values.nama);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('alamat', values.alamat);
      formData.append('noTelp', values.noTelp);
      if (values.instansi) {
        formData.append('instansi', values.instansi);
      }
  
      const response = await registerUser(formData);
      
      // Jika sampai sini berarti registrasi berhasil
      toast({
        title: "Berhasil",
        description: "Registrasi berhasil. Silakan cek email untuk kode OTP",
      });
      
      // Navigasi ke halaman verifikasi OTP
      setTimeout(() => {
        navigate('/verify-otp', { 
          state: { email: values.email }
        });
      }, 1000);
      
    } catch (error: any) {
      // Hanya tampilkan toast error jika bukan error registrasi user
      if (error.message !== 'Error dalam registrasi user') {
        toast({
          title: "Error",
          description: error.message || "Terjadi kesalahan saat registrasi",
          variant: "destructive",
        });
      } else {
        // Jika error registrasi user tapi data masuk, tetap navigasi
        toast({
          title: "Berhasil",
          description: "Registrasi berhasil. Silakan cek email untuk kode OTP",
        });
        
        setTimeout(() => {
          navigate('/verify-otp', { 
            state: { email: values.email }
          });
        }, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    try {
      setIsLoading(true);
      console.log('Google response:', response);
      
      const result = await googleRegister(response.credential);
      console.log('Register result:', result);
      
      toast({
        title: "Berhasil",
        description: "Registrasi dengan Google berhasil",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Google register error:', error);
      
      if (error.message.includes('Email sudah terdaftar')) {
        toast({
          title: "Info",
          description: "Email sudah terdaftar. Silakan login menggunakan Google.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }
  
      toast({
        title: "Error",
        description: error.message || "Gagal registrasi dengan Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center mb-8">Sign Up</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nama */}
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your name"
                        {...field}
                        className="rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email"
                        type="email"
                        {...field}
                        className="rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="alamat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your address"
                        {...field}
                        className="rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="noTelp"
                render={({ field }) =>
                  <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your phone number"
                    {...field}
                    className="rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
                }
                />

            {/* Institution (Optional) */}
            <FormField
              control={form.control}
              name="instansi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your institution"
                      {...field}
                      className="rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        className="rounded-xl"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        {...field}
                        className="rounded-xl"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Login */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            toast({
              title: "Error",
              description: "Google sign up failed",
              variant: "destructive",
            });
          }}
          useOneTap
        />

        {/* Login Redirect Link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  </div>
);
};

export default RegisterPage;

