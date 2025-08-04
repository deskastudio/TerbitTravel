// components/debug/CORSHeader.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import axiosInstance from "@/lib/axios";
import { RequestHeaders, ResponseHeaders } from "@/types/api.types";

const CORSHeader = () => {
  const [requestHeaders, setRequestHeaders] = useState<RequestHeaders | null>(
    null
  );
  const [responseHeaders, setResponseHeaders] =
    useState<ResponseHeaders | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // This is a cleanup function
    return () => {
      // Reset state if component unmounts
    };
  }, []);

  const testCORS = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Capture the request headers from axios
      await axiosInstance.request({
        url: "/health",
        method: "OPTIONS",
        transformRequest: [
          (data, headers) => {
            // Capture the headers before sending - convert to our type
            const capturedHeaders: RequestHeaders = {};
            if (headers) {
              Object.keys(headers).forEach((key) => {
                const value = headers[key];
                if (typeof value === "string") {
                  capturedHeaders[key] = value;
                }
              });
            }
            setRequestHeaders(capturedHeaders);
            return data;
          },
        ],
      });

      // Now make an actual request to get response headers
      const response = await fetch(`${import.meta.env.VITE_API_URL}/health`, {
        method: "GET",
        credentials: "include",
      });

      // Get all headers from the response
      const allHeaders: ResponseHeaders = {};
      response.headers.forEach((value, key) => {
        allHeaders[key] = value;
      });

      setResponseHeaders(allHeaders);
    } catch (err: any) {
      console.error("CORS test error:", err);
      setError(err.message || "Error during CORS test");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>🔄 CORS Header Debug</span>
          <Button
            onClick={testCORS}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isLoading ? "Testing..." : "Test CORS Headers"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded border border-red-200">
            {error}
          </div>
        )}

        {requestHeaders && (
          <div className="space-y-2">
            <h3 className="font-semibold">🚀 Request Headers</h3>
            <div className="bg-gray-50 p-3 rounded overflow-x-auto">
              <pre className="text-xs">
                {JSON.stringify(requestHeaders, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {responseHeaders && (
          <div className="space-y-2">
            <h3 className="font-semibold">📥 Response Headers</h3>
            <div className="bg-gray-50 p-3 rounded overflow-x-auto">
              <pre className="text-xs">
                {JSON.stringify(responseHeaders, null, 2)}
              </pre>
            </div>

            <div className="space-y-1 mt-2">
              <h4 className="font-medium text-sm">Critical CORS Headers:</h4>
              <div className="grid grid-cols-2 gap-1">
                <div className="font-medium">Access-Control-Allow-Origin:</div>
                <div>
                  {responseHeaders["access-control-allow-origin"] ||
                    "❌ Missing"}
                </div>

                <div className="font-medium">
                  Access-Control-Allow-Credentials:
                </div>
                <div>
                  {responseHeaders["access-control-allow-credentials"] ||
                    "❌ Missing"}
                </div>

                <div className="font-medium">Access-Control-Allow-Methods:</div>
                <div>
                  {responseHeaders["access-control-allow-methods"] ||
                    "❌ Missing"}
                </div>

                <div className="font-medium">Access-Control-Allow-Headers:</div>
                <div className="truncate">
                  {responseHeaders["access-control-allow-headers"] ||
                    "❌ Missing"}
                </div>
              </div>
            </div>
          </div>
        )}

        <Separator />

        <div className="pt-2">
          <h3 className="font-semibold mb-2">📚 CORS Tips</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            <li>
              Browser prevents setting <strong>Origin</strong> header manually
              (security restriction)
            </li>
            <li>
              Server must respond with{" "}
              <strong>Access-Control-Allow-Origin</strong> matching your origin
            </li>
            <li>
              For cookies, server must set{" "}
              <strong>Access-Control-Allow-Credentials: true</strong>
            </li>
            <li>
              Check that backend CORS config includes your frontend origin
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CORSHeader;
