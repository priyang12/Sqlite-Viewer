import { useEffect, useRef, useState } from "react";
import { useIndexedDBContext } from "../Context/IndexedDBContext";
import { insertDB } from "../Utils/indexDBUtils";
import { useNavigate } from "react-router-dom";

const Demo = () => {
  const [fetching, setFetching] = useState<boolean>();
  const { indexDB: indexedDB } = useIndexedDBContext();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    (async () => {
      if (indexedDB) {
        setFetching(true);
        try {
          const response = await fetch("/demo.db");
          const arrayBuffer = await response.arrayBuffer();
          const fileData = new Uint8Array(arrayBuffer);
          const file = new File([fileData], "demo.db", {
            type: "application/octet-stream",
          });

          const result = await insertDB(indexedDB, file);
          if (result) {
            navigate("/");
          }
        } catch (error) {
          console.error(error);
        } finally {
          setFetching(false);
        }
      }
    })();
  }, [indexedDB]);
  if (fetching) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-lg text-base-content">Fetching database...</p>
        </div>
      </div>
    );
  }
};

export default Demo;
