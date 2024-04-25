import { useParams } from "react-router-dom";
import TableSideBar from "../Components/TableSideBar";

const DataBaseLayout = () => {
  const { name } = useParams();

  return (
    <div className=" min-h-lvh bg-base-100">
      <header className="flex justify-center my-5">
        <h1 className="text-5xl font-thin">DataBase : {name}</h1>
      </header>
      <main className="flex bg-base-200">
        <TableSideBar />
        <section className="w-full"></section>
      </main>
    </div>
  );
};

export default DataBaseLayout;
