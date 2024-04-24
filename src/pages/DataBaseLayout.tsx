import { useParams } from "react-router-dom";
import TableSideBar from "../Components/TableSideBar";

const DataBaseLayout = () => {
  const { name } = useParams();

  return (
    <div className="py-5 min-h-lvh bg-base-100">
      <header className="flex justify-center">
        <h1 className="text-5xl font-thin">DataBase : {name}</h1>
      </header>
      <main className="bg-base-200">
        <TableSideBar />
      </main>
    </div>
  );
};

export default DataBaseLayout;
