// components/debug/APIConnectionTest.tsx
import React, { useState } from 'react';
import { testMainAPIConnection, checkMainAPIHealth } from '@/lib/axios';
import { testDestinationAPI, testBackendHealth } from '@/utils/api-test';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TestResult, TestResults } from '@/types/api.types';

const APIConnectionTest = () => {
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTests = async () => {
    setIsLoading(true);
    setTestResults(null);

    try {
      console.log('🧪 Running API connection tests...');
      
      // Test 1: Health check with fetch
      const healthResult = await checkMainAPIHealth();
      
      // Test 2: Axios instance test
      const axiosResult = await testMainAPIConnection();
      
      // Test 3: Destinations endpoint
      const destinationsResult = await fetch(`${import.meta.env.VITE_API_URL}/destination/getAll`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(import.meta.env.VITE_API_URL.includes('loca.lt') && {
            'ngrok-skip-browser-warning': 'true'
          })
        }
      }).then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          return { success: true, data, status: res.status };
        } else {
          return { success: false, status: res.status, statusText: res.statusText, data: null };
        }
      }).catch((error: any) => ({ success: false, error: error.message, data: null }));

      setTestResults({
        healthCheck: healthResult,
        axiosTest: axiosResult,
        destinationsTest: destinationsResult,
        environment: {
          VITE_API_URL: import.meta.env.VITE_API_URL,
          currentOrigin: window.location.origin,
          userAgent: navigator.userAgent.substring(0, 50) + '...'
        }
      });

    } catch (error: unknown) {
      console.error('❌ Test execution error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTestResults({
        error: 'Failed to run tests',
        details: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (success?: boolean) => {
    if (success === undefined) return <Badge variant="secondary">❓ Unknown</Badge>;
    return (
      <Badge variant={success ? "default" : "destructive"}>
        {success ? "✅ Success" : "❌ Failed"}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          🧪 API Connection Diagnostics
          <Button 
            onClick={runTests} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? "Testing..." : "Run Tests"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {testResults && (
          <div className="space-y-4">
            {/* Environment Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🌐 Environment</h3>
              <div className="text-sm space-y-1">
                <div><strong>API URL:</strong> {testResults.environment?.VITE_API_URL}</div>
                <div><strong>Origin:</strong> {testResults.environment?.currentOrigin}</div>
                <div><strong>User Agent:</strong> {testResults.environment?.userAgent}</div>
              </div>
            </div>

            {/* Test Results */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Health Check */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Health Check</h4>
                  {getStatusBadge(testResults.healthCheck?.success)}
                </div>
                <div className="text-xs space-y-1">
                  <div>Status: {testResults.healthCheck?.status || 'N/A'}</div>
                  {testResults.healthCheck?.error && (
                    <div className="text-red-600">Error: {testResults.healthCheck.error}</div>
                  )}
                </div>
              </div>

              {/* Axios Test */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Axios Instance</h4>
                  {getStatusBadge(testResults.axiosTest?.success)}
                </div>
                <div className="text-xs space-y-1">
                  <div>Status: {testResults.axiosTest?.status || 'N/A'}</div>
                  {testResults.axiosTest?.error && (
                    <div className="text-red-600">Error: {testResults.axiosTest.error}</div>
                  )}
                </div>
              </div>

              {/* Destinations Test */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Destinations API</h4>
                  {getStatusBadge(testResults.destinationsTest?.success)}
                </div>
                <div className="text-xs space-y-1">
                  <div>Status: {testResults.destinationsTest?.status || 'N/A'}</div>
                  {testResults.destinationsTest?.error && (
                    <div className="text-red-600">Error: {testResults.destinationsTest.error}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Error Details */}
            {testResults.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">Error Details</h4>
                <div className="text-sm text-red-700">{testResults.error}</div>
                {testResults.details && (
                  <div className="text-xs text-red-600 mt-1">{testResults.details}</div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default APIConnectionTest;
