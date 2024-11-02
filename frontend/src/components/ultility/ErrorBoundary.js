/**
 * ErrorBoundary Component
 * 
 * A class component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * 
 * Features:
 * - Catches runtime errors in child components
 * - Displays user-friendly error message
 * - Provides recovery options (return to homepage or reload)
 * - Shows detailed error information in development environment
 * - Maintains application stability by preventing complete crashes
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
    /**
     * Initialize component state
     * @param {Object} props - Component props
     */
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false,    // Flag indicating if an error has occurred
            error: null,        // The error object
            errorInfo: null     // Additional error information
        };
    }

    /**
     * Static lifecycle method called when an error is thrown
     * Used to update state based on caught error
     * 
     * @param {Error} error - The error that was thrown
     * @returns {Object} Updated state object
     */
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    /**
     * Lifecycle method called after an error is caught
     * Used to log error details and update component state
     * 
     * @param {Error} error - The error that was thrown
     * @param {Object} errorInfo - Additional information about the error
     */
    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Error caught in ErrorBoundary: ", error, errorInfo);
    }

    /**
     * Render method handles two cases:
     * 1. When an error occurs: displays fallback UI with error message and recovery options
     * 2. Normal case: renders children components
     */
    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                    <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
                        {/* Error icon */}
                        <div className="mb-6">
                            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        {/* Error message */}
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-gray-600 mb-8">
                            We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
                        </p>

                        {/* Recovery action buttons */}
                        <div className="space-y-4">
                            {/* Return to homepage button - also resets error state */}
                            <Link 
                                to="/"
                                className="inline-block w-full sm:w-auto px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                                onClick={() => this.setState({ hasError: false })}
                            >
                                Return to Homepage
                            </Link>

                            {/* Reload page button */}
                            <button 
                                onClick={() => window.location.reload()}
                                className="inline-block w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors ml-0 sm:ml-4 mt-4 sm:mt-0"
                            >
                                Try Again
                            </button>
                        </div>

                        {/* Development-only error details section */}
                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-8 text-left">
                                <details className="bg-gray-50 rounded-lg p-4">
                                    <summary className="text-sm text-gray-700 cursor-pointer font-medium">
                                        Error Details
                                    </summary>
                                    <pre className="mt-4 text-xs text-red-600 overflow-auto">
                                        {/* Display the error message and stack trace */}
                                        {this.state.error && this.state.error.toString()}
                                        <br />
                                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                                    </pre>
                                </details>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // If no error occurred, render children normally
        return this.props.children;
    }
}

export default ErrorBoundary;