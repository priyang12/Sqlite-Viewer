import useDark from "../Hooks/useDark";

const NotFound = () => {
  const { isDarkMode } = useDark();
  console.log(isDarkMode);

  return (
    <div
      className={`flex justify-center items-center h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-200"
      }`}
    >
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-800 mb-4">
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
