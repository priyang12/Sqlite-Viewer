import InputDB from "../Components/InputDB/InputDB";
import { Link } from "react-router-dom";
import type { storedKeysType } from "../Hooks/useGetUserDBs";
import { useDBStore } from "../Hooks/useDBStore";
import ErrorFallbackComponent, {
  WrappedErrorBoundary,
} from "../Components/ErrorFallbackComponent/ErrorFallbackComponent";
import { ErrorBoundary } from "react-error-boundary";

function UsersDBList({
  storedDBs,
  removeUserDB,
}: {
  storedDBs: storedKeysType;
  removeUserDB: (fileName: string) => Promise<void>;
}) {
  return (
    <ul className="flex h-full flex-col items-center gap-5 overflow-y-scroll rounded-lg bg-base-200 p-5 sm:w-[60%]">
      {storedDBs.map((item, index) => (
        <li
          className="flex w-full items-center justify-evenly gap-10"
          key={item.toString()}
        >
          <span className="">
            <Link
              className="btn btn-circle btn-active"
              to={`/db/${item.toString()}`}
            >
              {index + 1}
            </Link>
          </span>
          <span className="w-[60%] truncate text-xl">
            <Link to={`/db/${item.toString()}`} className="link">
              {item.toString()}
            </Link>
          </span>
          <button
            onClick={() => removeUserDB(item.toString())}
            className="btn btn-neutral hover:bg-red-500"
          >
            remove
          </button>
        </li>
      ))}
    </ul>
  );
}

function NoDBList() {
  return (
    <div className="flex flex-col gap-4 self-center sm:w-[60%]">
      <h2 className="mb-2 text-4xl font-bold">No Database Found</h2>
      <p className="mb-4 text-lg">
        It looks like you haven't added any databases yet. Why not try adding
        one now?
      </p>
      <p className="text-md">
        Drag and drop your database file into the designated area on the right
        or click the upload button to get started.
      </p>
      <div className="my-4 self-end">
        <Link to="/help" className="btn btn-info">
          How to Add a Database
        </Link>
      </div>
      <p className="text-sm">
        Need help? visit the{" "}
        <Link to="/support" className="link link-primary">
          Support
        </Link>{" "}
        page for more assistance.
      </p>
    </div>
  );
}

const Home = () => {
  const {
    isLoading: Loading,
    storedDBs,
    insertUserDB,
    removeUserDB,
  } = useDBStore();

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
    <div className="box-border flex min-h-lvh w-full justify-center">
      <div className="h-screen w-full pt-5">
        <h1 className="text-center text-4xl font-bold">Your Databases</h1>
        <div className="my-5 flex h-[80vh] w-full flex-col justify-evenly gap-5 bg-base-300 p-5 sm:flex-row">
          <div className="h-full sm:w-[40%]">
            <WrappedErrorBoundary>
              <InputDB onFileSelect={onSelectFile} />
            </WrappedErrorBoundary>
          </div>

          <ErrorBoundary
            fallbackRender={(props) => (
              <div className="flex h-full flex-col items-center gap-5 overflow-y-scroll rounded-lg bg-base-200 p-5 sm:w-[60%]">
                <ErrorFallbackComponent {...props} />
              </div>
            )}
          >
            {storedDBs.length > 0 ? (
              <UsersDBList storedDBs={storedDBs} removeUserDB={removeUserDB} />
            ) : (
              <NoDBList />
            )}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default Home;
