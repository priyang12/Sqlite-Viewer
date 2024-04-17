import { useState } from "react";
import { useGetUserDBs } from "../Hooks/useGetUserDBs";
import { useGetDBContext } from "../Context/DBContext";
import InputDB from "../Components/InputDB/InputDB";
import { insertDB, removeDb } from "../Utils/indexDBUtils";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const { indexedDB } = useGetDBContext();
  const { storedDBs } = useGetUserDBs();

  const onSelectFile = async (file: File | null) => {
    if (indexedDB && file) {
      setLoading(true);

      insertDB(indexedDB, file);
      setLoading(false);
    }
  };

  const remove = async (fileName: string) => {
    if (indexedDB) {
      const result = await removeDb(indexedDB, fileName);
      if (result) alert(`The DB ${fileName} has been removed`);
    }
  };

  if (loading)
    return (
      <span className="loading loading-spinner loading-lg text-primary"></span>
    );

  return (
    <div className="dark:bg-gray-800 bg-gray-200 flex justify-center min-h-lvh">
      <div className="flex flex-col">
        <div className="my-5">
          <h1 className="text-5xl font-bold">Your Databases</h1>
          {storedDBs
            ? storedDBs.map((item) => (
                <div className="flex justify-between" key={item.toString()}>
                  <h2>{item.toString()}</h2>
                  <button onClick={() => remove(item.toString())}>
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
