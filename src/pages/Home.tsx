import { useEffect } from "react";
import InputDB from "../Components/InputDB/InputDB";
import { useStoreContext } from "../Context/StoreContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { Loading, storedDBs, insertUserDB, removeUserDB } = useStoreContext();

  // temporary push it to default DB.
  let navigate = useNavigate();
  useEffect(() => {
    if (true) {
      return navigate("/db/seed.db");
    }
  }, []);

  const onSelectFile = async (file: File | null) => {
    if (file) {
      insertUserDB(file);
    }
  };

  if (Loading)
    return (
      <div className="flex min-h-lvh justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="flex min-h-lvh justify-center bg-gray-200 dark:bg-gray-800">
      <div className="flex flex-col">
        <div className="my-5">
          <h1 className="text-5xl font-bold">Your Databases</h1>
          {storedDBs.length > 0
            ? storedDBs.map((item) => (
                <div className="flex justify-between" key={item.toString()}>
                  <h2 className="w-1/2 truncate">{item.toString()}</h2>
                  <button onClick={() => removeUserDB(item.toString())}>
                    remove
                  </button>
                </div>
              ))
            : null}
        </div>
        <InputDB onFileSelect={onSelectFile} />
      </div>
    </div>
  );
};

export default Home;
