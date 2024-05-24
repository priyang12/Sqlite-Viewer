import useDark from "../Hooks/useDark";

const NotFound = () => {
  const { isDarkMode } = useDark();
  console.log(isDarkMode);

  return (
    <div
      className={`flex h-screen items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-gray-200"
      }`}
    >
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-red-800">
          404 - Not Found
        </h1>
        <p
          className={`text-lg ${
            isDarkMode ? "text-gray-200" : "text-gray-600"
          } `}
        >
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
