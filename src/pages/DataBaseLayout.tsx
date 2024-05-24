import { useParams } from "react-router-dom";
import { useGetDBContext } from "../Context/DBContext";
import { useEffect } from "react";

const DataBaseLayout = () => {
  const { name } = useParams();
  const { setDBFileName } = useGetDBContext();

  useEffect(() => {
    if (name) {
      setDBFileName(name);
    }
  }, [name]);

  return (
    <div className="min-h-lvh bg-blue-900 py-5">
      <header className="flex justify-center">
        <h1 className="text-5xl font-thin">DataBase : {name}</h1>
      </header>
    </div>
  );
};

export default DataBaseLayout;
