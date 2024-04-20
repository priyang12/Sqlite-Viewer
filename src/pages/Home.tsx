import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  // temporary push it to default DB.
  let navigate = useNavigate();
  useEffect(() => {
    if (true) {
      return navigate("/db/default");
    }
  }, []);

  return (
    <div className="dark:bg-gray-800 bg-gray-200 flex justify-center min-h-lvh">
      <div className="flex flex-col">
        <div className="my-5">
          <h1 className="text-5xl font-bold">Your Databases</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
