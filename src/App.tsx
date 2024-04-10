import { useEffect, useState } from "react";
import "./App.css";
import InputDB from "./Components/InputDB/InputDB";
import useGetDB from "./Hooks/useGetDB";
import { SqlValue } from "sql.js";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tables, setTables] = useState<SqlValue[]>();
  const { db } = useGetDB(selectedFile);

  useEffect(() => {
    if (db) {
      const query = "SELECT name FROM sqlite_master WHERE type='table'";
      const result = db.exec(query);
      const tables = result[0].values.map((row) => row[0]);
      setTables(tables);
    }
  }, [db]);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    // You can perform additional actions with the selected file here
  };

  return (
    <>
      <h1>Vite + React</h1>
      <div>
        <h1>SQLite Database Input</h1>
        <InputDB onFileSelect={handleFileSelect} />
        {selectedFile && <p>Selected File: {selectedFile.name}</p>}
        {tables ? tables.map((item) => <div>{item}</div>) : null}
      </div>
    </>
  );
}

export default App;
