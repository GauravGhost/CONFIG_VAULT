import { isRouteErrorResponse, useRouteError } from "react-router";

export function ErrorBoundary() {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
          <p className="text-lg mb-6">Sorry, the page you are looking for doesn't exist.</p>
          <a 
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go back to home
          </a>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          {error.status} - {error.statusText}
        </h1>
        <p className="text-lg mb-6">{error.data?.message || "An unexpected error occurred"}</p>
        <a 
          href="/" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Go back to home
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
      <p className="text-lg mb-6">
        {error instanceof Error ? error.message : "An unexpected error occurred"}
      </p>
      <a 
        href="/" 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Go back to home
      </a>
    </div>
  );
}
