import { Component, ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';
/**
 * Props interface for the ErrorBoundary component
 * @interface ErrorBoundaryProps
 * @property {ReactNode} children - Child components to be wrapped by the error boundary
 * @property {ReactNode | ((recoveryFn: () => void, error: Error, errorInfo?: ErrorInfo) => ReactNode)} [fallback] - Custom fallback UI or render prop function
 * @property {(error: Error, errorInfo: ErrorInfo) => void} [onError] - Callback when an error is caught
 * @property {string} [context] - Additional context information about where the error occurred
 * @property {boolean} [resetOnChange] - Whether to auto-reset when children change (default: true)
 * @property {number} [maxResets] - Maximum number of automatic reset attempts (default: 3)
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((recoveryFn: () => void, error: Error, errorInfo?: ErrorInfo) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  context?: string;
  resetOnChange?: boolean;
  maxResets?: number;
}

/**
 * State interface for the ErrorBoundary component
 * @interface ErrorBoundaryState
 * @property {boolean} hasError - Flag indicating if an error has been caught
 * @property {Error | null} error - The caught error object
 * @property {ErrorInfo | null} errorInfo - Additional error information
 * @property {number} resetCount - Number of reset attempts
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  resetCount: number;
}

/**
 * A reusable error boundary component that catches JavaScript errors in its child component tree.
 * @class ErrorBoundary
 * @extends {Component<ErrorBoundaryProps, ErrorBoundaryState>}
 * @example
 * // Basic usage
 * <ErrorBoundary>
 *   <BuggyComponent />
 * </ErrorBoundary>
 * 
 * @example
 * // With custom fallback
 * <ErrorBoundary 
 *   fallback={<div>Something went wrong!</div>}
 *   context="UserProfileSection"
 * >
 *   <UserProfile />
 * </ErrorBoundary>
 * 
 * @example
 * // With recovery function
 * <ErrorBoundary
 *   fallback={(recover) => (
 *     <div>
 *       <p>Error occurred!</p>
 *       <button onClick={recover}>Try Again</button>
 *     </div>
 *   )}
 * >
 *   <UnstableComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static defaultProps: Partial<ErrorBoundaryProps> = {
    resetOnChange: true,
    maxResets: 3
  };

  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
    resetCount: 0
  };

  /**
   * Updates state when an error is caught
   * @static
   * @param {Error} error - The caught error
   * @returns {ErrorBoundaryState} The new state
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { 
      hasError: true,
      error
    };
  }

  /**
   * Lifecycle method that catches errors in child components
   * @param {Error} error - The thrown error
   * @param {ErrorInfo} errorInfo - Information about which component threw the error
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
    
    // Log to error tracking service
    console.error('ErrorBoundary caught an error:', error, errorInfo, {
        context: this.props.context
    });
      // logErrorToService(error, errorInfo, this.props.context);
    
  }

  /**
   * Reset the error boundary when children change
   * @param {ErrorBoundaryProps} prevProps - Previous props
   */
  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { children, resetOnChange } = this.props;
    if (resetOnChange && children !== prevProps.children) {
      this.resetErrorBoundary();
    }
  }

  /**
   * Resets the error boundary state
   * @method resetErrorBoundary
   */
  resetErrorBoundary = () => {
    const { resetCount } = this.state;
    const { maxResets } = this.props;
    
    if (maxResets && resetCount >= maxResets) {
      console.warn('Max reset attempts reached');
      return;
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      resetCount: prevState.resetCount + 1
    }));
  };

  /**
   * Renders the component
   * @returns {ReactNode}
   */

render(): ReactNode {
  const { hasError, error, errorInfo } = this.state;
  const { children, fallback } = this.props;

  if (hasError) {
    if (typeof fallback === 'function') {
      return fallback(this.resetErrorBoundary, error!, errorInfo || undefined);
    }

    if (fallback) {
      return fallback;
    }

    return (
      <div className="error-boundary-container">
        <div className="error-boundary-header">
          <svg className="error-boundary-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
          </svg>
          <h3 className="error-boundary-title">Component Error</h3>
        </div>
        
        {this.props.context && (
          <p className="error-context">Error in: {this.props.context}</p>
        )}

        <div className="error-boundary-details">
          <details>
            <summary>Technical details</summary>
            <pre className="error-message">{error?.toString()}</pre>
            {errorInfo?.componentStack && (
              <pre className="error-stack">{errorInfo.componentStack}</pre>
            )}
          </details>
        </div>

        <div className="error-boundary-actions">
          <button 
            className="error-retry-button"
            onClick={this.resetErrorBoundary}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="currentColor"/>
            </svg>
            Retry
          </button>

          <button 
            className="error-reload-button"
            onClick={() => window.location.reload()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 4V1L8 5L12 9V6C15.31 6 18 8.69 18 12C18 15.31 15.31 18 12 18C8.69 18 6 15.31 6 12H4C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="currentColor"/>
            </svg>
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return children;
}

}

export default ErrorBoundary;