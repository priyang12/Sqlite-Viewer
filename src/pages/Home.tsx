import { useState } from "react";
import { useGetUserDBs } from "../Hooks/useGetUserDBs";
import { useGetDBContext } from "../Context/DBContext";
import InputDB from "../Components/InputDB/InputDB";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const { indexedDB } = useGetDBContext();
  const { storedDBs } = useGetUserDBs();

  const onSelectFile = async (file: File | null) => {
    if (indexedDB && file) {
      setLoading(true);
      const transaction = indexedDB.transaction("DBFiles", "readwrite");
      const store = transaction.objectStore("DBFiles");
      await store.add(file, file.name);
      setLoading(false);
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
                <h2 key={item.toString()}>{item.toString()}</h2>
              ))
            : null}
        </div>
        <InputDB onFileSelect={onSelectFile} />
      </div>
    </div>
  );
};

export default Home;
