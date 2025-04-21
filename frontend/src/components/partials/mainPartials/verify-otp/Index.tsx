// src/components/partials/mainPartials/register/verify-otp/Index.tsx

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const OTPEntryPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  // Redirect if no email
  if (!email) {
    navigate('/register');
    return null;
  }

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast({
        title: "Error",
        description: "Silakan masukkan OTP 6 digit",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otpString
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: "OTP berhasil diverifikasi"
        });
        navigate('/login');
      } else {
        throw new Error(data.message || 'Verifikasi gagal');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Verifikasi OTP</CardTitle>
          <CardDescription>
            Masukkan kode OTP yang dikirim ke {email}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleVerify}>
          <CardContent>
            <div className="flex gap-2 justify-center my-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  className="w-12 h-12 text-center border rounded-lg text-lg"
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Memverifikasi..." : "Verifikasi OTP"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // Handle resend OTP
              }}
              className="w-full"
            >
              Kirim Ulang OTP
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default OTPEntryPage;