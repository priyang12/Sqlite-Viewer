import React from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

const ErrorFallbackComponent: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md rounded-box border-4 border-error bg-error/10 p-6 shadow-lg">
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="mt-2 text-sm">{error.message}</p>
        <button
          className="btn btn-outline btn-error mt-4"
          onClick={resetErrorBoundary}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export const WrappedErrorBoundary = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorFallbackComponent;
