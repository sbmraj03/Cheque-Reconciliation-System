// Lightweight error boundary to catch render-time exceptions and show a friendly UI
// This prevents the entire app from going blank if a child component throws.
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In a real app, send this to logging infrastructure
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    // Simple reset to attempt re-render; parent state may still hold bad data
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-2xl mx-auto mt-10 bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-red-600 text-xl">❌</span>
            <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
          </div>
          <p className="text-red-700 text-sm mb-4">An unexpected error occurred while rendering this section.</p>
          <pre className="text-xs text-red-800 bg-white/60 rounded border p-3 overflow-auto max-h-40">
            {this.state.error?.message || 'Unknown error'}
          </pre>
          <div className="mt-4">
            <button onClick={this.handleReset} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


