// midtrans.service.ts - Dedicated service for Midtrans integration
import { toast } from "@/hooks/use-toast";

interface MidtransOptions {
  onSuccess?: (result: any) => void;
  onPending?: (result: any) => void;
  onError?: (result: any) => void;
  onClose?: () => void;
}

// Declare global Midtrans Snap interface
declare global {
  interface Window {
    snap?: {
      pay: (snapToken: string, options: any) => void;
      hide?: () => void;
    };
  }
}

/**
 * A dedicated service to handle Midtrans integration
 */
export class MidtransService {
  private static readonly SCRIPT_URL =
    "https://app.sandbox.midtrans.com/snap/snap.js";
  private static isScriptLoaded = false;
  private static isLoading = false;
  private static clientKey =
    import.meta.env.VITE_MIDTRANS_CLIENT_KEY ||
    "SB-Mid-client-TmZuv7Het-1NYCDZ";

  /**
   * Load the Midtrans Snap library
   */
  private static async loadScript(): Promise<boolean> {
    // Don't load again if already loaded
    if (this.isScriptLoaded) {
      console.log("📜 Midtrans script already loaded");
      return true;
    }

    // Don't start another load if one is in progress
    if (this.isLoading) {
      console.log("⏳ Midtrans script is currently loading, waiting...");
      return new Promise((resolve) => {
        const checkLoaded = setInterval(() => {
          if (this.isScriptLoaded || !this.isLoading) {
            clearInterval(checkLoaded);
            resolve(this.isScriptLoaded);
          }
        }, 200);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkLoaded);
          resolve(this.isScriptLoaded);
        }, 10000);
      });
    }

    this.isLoading = true;

    return new Promise((resolve, reject) => {
      try {
        // Check if script already exists
        const existingScript = document.querySelector('script[src*="snap.js"]');
        if (existingScript) {
          console.log("📜 Found existing Midtrans script tag");
          this.isScriptLoaded = true;
          this.isLoading = false;
          resolve(true);
          return;
        }

        // Remove any old scripts first
        const oldScripts = document.querySelectorAll('script[src*="midtrans"]');
        oldScripts.forEach((script) => script.remove());

        // Create new script tag
        const script = document.createElement("script");

        // 🔧 FIX: Don't add origin parameter, let Midtrans handle it
        script.src = this.SCRIPT_URL;
        script.setAttribute("data-client-key", this.clientKey);

        // 🔧 FIX: Add crossorigin attribute for better security
        script.crossOrigin = "anonymous";

        console.log(`🔄 Loading Midtrans script`);
        console.log(
          `🔑 Using client key: ${this.clientKey.substring(0, 15)}...`
        );

        // Setup event handlers with timeout
        const timeoutId = setTimeout(() => {
          console.error("❌ Midtrans script loading timeout");
          this.isLoading = false;
          reject(new Error("Midtrans script loading timeout"));
        }, 15000); // 15 second timeout

        script.onload = () => {
          clearTimeout(timeoutId);
          console.log("✅ Midtrans script loaded successfully");
          this.isScriptLoaded = true;
          this.isLoading = false;

          // Verify window.snap is available
          if (typeof window !== "undefined" && (window as any).snap) {
            console.log("✅ window.snap is available");
            resolve(true);
          } else {
            console.error("❌ window.snap not available after script load");
            // Wait a bit more
            setTimeout(() => {
              if ((window as any).snap) {
                resolve(true);
              } else {
                reject(new Error("window.snap not available"));
              }
            }, 1000);
          }
        };

        script.onerror = (error) => {
          clearTimeout(timeoutId);
          console.error("❌ Failed to load Midtrans script:", error);
          this.isLoading = false;
          reject(new Error("Failed to load Midtrans script"));
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error("❌ Error in script loading:", error);
        this.isLoading = false;
        reject(error);
      }
    });
  }

  /**
   * Create Midtrans snap token for payment
   */
  public static async createSnapToken(bookingId: string): Promise<string> {
    try {
      console.log(`🔄 Creating snap token for booking: ${bookingId}`);

      // Always use localhost for internal API calls to avoid tunnel authentication issues
      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `📌 Server responded with ${response.status}: ${errorText}`
        );
        throw new Error(
          `Failed to create payment token: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.snapToken) {
        console.error("📌 Server response missing snapToken:", data);
        throw new Error("Server response missing snapToken");
      }

      console.log(
        "✅ Snap token created:",
        data.snapToken?.substring(0, 20) + "..."
      );

      return data.snapToken;
    } catch (error) {
      console.error("❌ Error creating snap token:", error);
      throw error;
    }
  }

  /**
   * Open Midtrans payment popup for a booking
   */
  public static async openPaymentPopup(
    snapToken: string,
    options: MidtransOptions = {}
  ): Promise<void> {
    try {
      // Show loading toast to indicate something is happening
      toast({
        title: "Mempersiapkan pembayaran...",
        description:
          "Mohon tunggu sebentar, halaman pembayaran akan segera muncul",
      });

      // Validate snap token
      if (!snapToken || typeof snapToken !== "string") {
        console.error("❌ Invalid snap token:", snapToken);
        throw new Error("Invalid snap token provided");
      }

      // Check if Midtrans script is available (should be loaded from HTML)
      console.log("🔄 Checking Midtrans script availability...");

      // Wait for script to be available with timeout
      let attempts = 0;
      const maxAttempts = 10;

      while (!window.snap && attempts < maxAttempts) {
        console.log(
          `⏳ Waiting for Midtrans script... (attempt ${
            attempts + 1
          }/${maxAttempts})`
        );
        await new Promise((resolve) => setTimeout(resolve, 500));
        attempts++;
      }

      if (typeof window === "undefined" || !window.snap) {
        console.error("❌ Midtrans Snap not available after waiting");
        console.error("❌ Please ensure snap.js is loaded in HTML head");
        throw new Error("Midtrans Snap is not available - script not loaded");
      }

      console.log("✅ Midtrans Snap is available");

      // Close any existing popup
      try {
        window.snap.hide?.();
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (e) {
        // Ignore error if no popup is open
      }

      console.log(
        "🚀 Opening Midtrans popup with token:",
        snapToken.substring(0, 20) + "..."
      );

      // 🔧 FIX: Configure Snap pay with supported options only
      const snapConfig = {
        onSuccess: (result: any) => {
          console.log("✅ Payment success:", result);
          toast({
            title: "Pembayaran Berhasil!",
            description: "Pembayaran Anda telah berhasil diproses.",
          });
          if (options.onSuccess) options.onSuccess(result);
        },
        onPending: (result: any) => {
          console.log("⏳ Payment pending:", result);
          toast({
            title: "Pembayaran Tertunda",
            description:
              "Pembayaran Anda sedang diproses, mohon tunggu konfirmasi.",
          });
          if (options.onPending) options.onPending(result);
        },
        onError: (result: any) => {
          console.error("❌ Payment error:", result);
          toast({
            variant: "destructive",
            title: "Pembayaran Gagal",
            description: "Terjadi kesalahan dalam proses pembayaran.",
          });
          if (options.onError) options.onError(result);
        },
        onClose: () => {
          console.log("🔒 Payment popup closed");
          if (options.onClose) options.onClose();
        },
      };

      // Open Snap popup
      window.snap.pay(snapToken, snapConfig);
    } catch (error) {
      console.error("💥 Error opening payment popup:", error);
      toast({
        variant: "destructive",
        title: "Gagal membuka pembayaran",
        description:
          "Terjadi kesalahan saat membuka halaman pembayaran. Silakan refresh halaman dan coba lagi.",
      });
      throw error;
    }
  }

  /**
   * Check if Midtrans script is loaded
   */
  public static isLoaded(): boolean {
    return (
      this.isScriptLoaded && typeof window !== "undefined" && !!window.snap
    );
  }

  /**
   * Get Midtrans client key
   */
  public static getClientKey(): string {
    return this.clientKey;
  }
}
