import { useEffect, useState } from "react";
import { useDefaultGetDB } from "./Hooks/useDefaultGetDB";
import { SqlValue } from "sql.js";

function App() {
  const [tables, setTables] = useState<SqlValue[]>();
  const { db } = useDefaultGetDB();
  useEffect(() => {
    if (db) {
      const query = "SELECT name FROM sqlite_master WHERE type='table'";
      const result = db.exec(query);
      const tables = result[0].values.map((row) => row[0]);
      setTables(tables);
    }
  }, [db]);

  return (
    <>
      <div className="bg-gray-500 flex justify-center min-h-lvh">
        <div>
          <h1 className="text-3xl font-bold underline">SQLite Database</h1>
          <table className="table-auto">
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
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
