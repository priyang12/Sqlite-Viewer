import { useGetData } from "../../Hooks/useGetData";

const tableQuery = "SELECT name FROM sqlite_master WHERE type='table'";

function TableSideBar() {
  const { row: tables, loading } = useGetData(tableQuery);

  if (loading) {
    return (
      <div className="flex m-10 min-h-[40vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <section className="flex m-5 min-h-[80vh]">
        <div className="flex flex-col m-5 bg-primary text-primary-content rounded">
          <h2 className="text-xl text-center font-bold">Tables </h2>
          <ul className="mx-5">
            {tables
              ? tables.map((item) => (
                  <li key={item?.toString()}>{item?.toString()}</li>
                ))
              : null}
          </ul>
        </div>
      </section>
    </>
  );
}

export default TableSideBar;
