import React, { useState } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

const currentMode = import.meta.env.MODE;
const isDev = currentMode === "development";

// little hacky maybe we can pass the HOC with ComponentName prop
// or Monkey-patch custom throwError components to throw labeled errors.
const parseComponentName = (stack?: string): string | undefined => {
  if (!stack) return;

  const lines = stack.split("\n");

  for (const line of lines) {
    // Match "at ComponentName (file:line:col)"
    const match = line.match(/at\s+([A-Za-z0-9_$]+)\s+\(/);
    if (match) {
      return match[1];
    }
  }

  return undefined;
};

const ErrorFallbackComponent: React.FC<
  FallbackProps & {
    componentName?: string | undefined;
    componentStack?: string | undefined;
  }
> = ({ error, resetErrorBoundary, componentName, componentStack }) => {
  console.log(componentName);

  return (
    <div className="flex h-full w-full items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-4xl rounded-box border-2 border-error bg-error/10 p-6 shadow-lg">
        {componentName ? (
          <h1 className="text-2xl font-semibold">
            Something went wrong at {componentName}
          </h1>
        ) : (
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
        )}

        <p className="my-3 break-words rounded-md bg-error/10 p-3 font-mono text-sm">
          {error.message}
        </p>

        {isDev && componentStack && (
          <details className="mb-6 whitespace-pre-wrap text-xs text-gray-500">
            <summary className="mb-2 cursor-pointer font-medium">
              View stack trace
            </summary>
            <pre className="overflow-x-auto rounded bg-base-100 p-3">
              {componentStack}
            </pre>
          </details>
        )}

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
  const [componentName, setComponentName] = useState<string>();
  const [componentStack, setComponentStack] = useState<string>();

  return (
    <ErrorBoundary
      fallbackRender={(props) => {
        return (
          <ErrorFallbackComponent
            {...props}
            componentName={componentName}
            componentStack={componentStack}
          />
        );
      }}
      onError={({ stack }) => {
        if (isDev) {
          setComponentStack(stack);
        }
        const name = parseComponentName(stack);
        console.log(name);

        setComponentName(name);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorFallbackComponent;
