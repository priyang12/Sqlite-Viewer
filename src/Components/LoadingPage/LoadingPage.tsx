const LoadingPage = ({ message = "Navigating...", to = "" }) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-base-100 text-base-content">
      <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-t-base-200" />
      <p className="text-lg font-medium">
        {message} {to}
      </p>
    </div>
  );
};

export default LoadingPage;
