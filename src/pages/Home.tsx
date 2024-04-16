import { useEffect, useState } from "react";
import { useGetDBContext } from "../Context/DBContext";
import type { SqlValue } from "sql.js";
import { openDB } from "idb";
import InputDB from "../Components/InputDB/InputDB";

const Home = () => {
  const [tables, setTables] = useState<SqlValue[]>();
  const [loading, setLoading] = useState(false);
  const { db, indexedDB } = useGetDBContext();

  useEffect(() => {
    if (db) {
      const query = "SELECT name FROM sqlite_master WHERE type='table'";
      const result = db.exec(query);
      const tables = result[0].values.map((row) => row[0]);
      setTables(tables);
    }
  }, [db]);

  const createDB = async () => {};

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
      <div>
        <h1 className="text-3xl font-bold underline">SQLite Database</h1>
        {/* <table className="table-auto">
          <thead>
            <tr>
              {tables
                ? tables.map((item) => (
                    <th key={item?.toString()}>{item?.toString()}</th>
                  ))
                : null}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
              <td>Malcolm Lockyer</td>
              <td>1961</td>
            </tr>
            <tr>
              <td>Witchy Woman</td>
              <td>The Eagles</td>
              <td>1972</td>
            </tr>
            <tr>
              <td>Shining Star</td>
              <td>Earth, Wind, and Fire</td>
              <td>1975</td>
            </tr>
          </tbody>
        </table> */}
        <InputDB onFileSelect={onSelectFile} />
        <button className="btn" onClick={createDB}>
          Click
        </button>
      </div>
    </div>
  );
};

export default Home;
