import React, { useEffect, useState, ErrorInfo, ReactNode, useCallback } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import AppRoutes from "./AppRoutes";
import { useAuthInit } from "./hooks/useAuthInit";
import { useNotificationSocket } from "./hooks/useNotificationSocket";
import { Bouncy } from 'ldrs/react';
import 'ldrs/react/Bouncy.css';

// Error Boundary Props and State
interface ErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  fallback?: (props: { error: Error; resetError: () => void }) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary Component
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { 
      hasError: true,
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback({ 
          error: this.state.error, 
          resetError: this.resetError 
        });
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              {this.state.error.message || 'An unexpected error occurred. Please try refreshing the page.'}
            </p>
            <button
              onClick={this.resetError}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mr-2"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Configure query client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { isInitializing } = useAuthInit();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      setError(event.error);
      console.error('Global error caught:', event.error);
    };

    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">
            {error.message || 'An unexpected error occurred. Please try refreshing the page.'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <Bouncy size="45" speed="1.75" color="#3b82f6" />
          <p className="mt-4 text-gray-600 font-medium">Loading application...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Component to handle the initial loading state
function InitialLoader({ message = 'Preparing your experience...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Bouncy size="45" speed="1.75" color="#3b82f6" />
        </div>
        <p className="text-gray-600 font-medium animate-pulse">{message}</p>
      </div>
    </div>
  );
}

// Error boundary fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-red-50 to-pink-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App component
function App() {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initialize client-side only code
    const initializeApp = async () => {
      try {
        // Add any async initialization here if needed
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
        setIsClient(true);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to initialize app');
        console.error('App initialization error:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Handle errors from child components
  const handleError = useCallback((error: Error) => {
    console.error('App caught error:', error);
    setError(error);
  }, []);

  // Reset error state
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // Show error boundary if there's an error
  if (error) {
    return <ErrorFallback error={error} resetErrorBoundary={resetError} />;
  }

  // Show loading state
  if (isLoading) {
    return <InitialLoader />;
  }

  // Don't render anything until client-side initialization is complete
  if (!isClient) {
    return null;
  }

  return (
    <ErrorBoundary 
      onError={(error) => handleError(error as Error)}
      fallback={({ error, resetError }) => (
        <ErrorFallback error={error} resetErrorBoundary={resetError} />
      )}
    >
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthInitializer>
            <AppRoutes />
            <Toaster 
              richColors
              toastOptions={{
                classNames: {
                  success: 'border-l-4 border-green-500',
                  error: 'border-l-4 border-red-500',
                  warning: 'border-l-4 border-yellow-500',
                  info: 'border-l-4 border-blue-500'
                },
                duration: 5000,
                closeButton: true
              }}
            />
          </AuthInitializer>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
