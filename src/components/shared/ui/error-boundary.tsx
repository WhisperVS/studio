import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | null;
  info?: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // log to console for now; in future, forward to telemetry
    console.error('ErrorBoundary caught:', error, info);
    this.setState({ error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-lg border bg-card">
          <h3 className="text-lg font-semibold">Something went wrong rendering the table</h3>
          <p className="text-sm text-muted-foreground mt-2">Please try your search again or refresh the page. Details were logged to the console.</p>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
