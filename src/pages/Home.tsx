import InputDB from "../Components/InputDB/InputDB";
import { useStoreContext } from "../Context/StoreContext";

const Home = () => {
  const { Loading, storedDBs, insertUserDB, removeUserDB } = useStoreContext();

  const onSelectFile = async (file: File | null) => {
    if (file) {
      insertUserDB(file);
    }
  };

  if (Loading)
    return (
      <div className="flex justify-center min-h-lvh">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="dark:bg-gray-800 bg-gray-200 flex justify-center min-h-lvh">
      <div className="flex flex-col">
        <div className="my-5">
          <h1 className="text-5xl font-bold">Your Databases</h1>
          {storedDBs.length > 0
            ? storedDBs.map((item) => (
                <div className="flex justify-between" key={item.toString()}>
                  <h2 className="truncate w-1/2">{item.toString()}</h2>
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
