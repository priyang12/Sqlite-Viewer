import { useParams, Outlet } from "react-router-dom";
import TableSideBar from "../../Components/TableSideBar";

const DataBaseLayout = () => {
  const { name } = useParams();

  return (
    <div className="bg-base-100">
      <header className="my-5 flex justify-center">
        <h1 className="text-5xl font-thin">DataBase : {name}</h1>
      </header>
      <main className="mx-16 mb-10 min-h-[100vh] overflow-hidden bg-base-200 md:flex">
        <TableSideBar />
        <section className="sm:w-3/4">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default DataBaseLayout;
