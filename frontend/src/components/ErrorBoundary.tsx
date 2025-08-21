// src/components/ErrorBoundary.tsx
// Buat file baru ini untuk menangkap error React

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      return (
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Terjadi Kesalahan</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-4">
                Maaf, terjadi kesalahan saat memuat halaman ini. 
                Silakan coba muat ulang halaman atau kembali ke halaman sebelumnya.
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={this.resetError}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Coba Lagi
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.history.back()}
                >
                  Kembali
                </Button>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 p-2 bg-muted rounded text-sm">
                  <summary className="cursor-pointer font-medium">Detail Error (Development)</summary>
                  <pre className="mt-2 whitespace-pre-wrap">{this.state.error.stack}</pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;