import { useParams, Outlet } from "react-router-dom";
import TableSideBar from "../../Components/TableSideBar";

const DataBaseLayout = () => {
  const { name } = useParams();

  return (
    <div className="bg-base-100">
      <header className="my-5 flex justify-center">
        <h1 className="text-5xl font-thin">DataBase : {name}</h1>
      </header>
      <main className="m-5 flex min-h-[80vh] bg-base-200">
        <TableSideBar />
        <section className="w-full">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default DataBaseLayout;
