import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  // temporary push it to default DB.
  const navigate = useNavigate();
  useEffect(() => {
    return navigate("/db/default");
  }, [navigate]);

  return (
    <div className="flex min-h-lvh justify-center bg-gray-200 dark:bg-gray-800">
      <div className="flex flex-col">
        <div className="my-5">
          <h1 className="text-5xl font-bold">Your Databases</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
