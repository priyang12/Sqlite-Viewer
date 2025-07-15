import { useEffect, useState } from "react";
import Skeleton from "../../Components/Skeleton";
import { useParams } from "react-router-dom";

function Meta() {
  return (
    <>
      <title>Overview</title>
      <meta
        name="description"
        content="Get a quick summary of your database. Search, view, and prepare to edit your tables as needed."
      />
    </>
  );
}

const Overview = () => {
  const { name } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(loadingTimer);
  }, []);

  return (
    <>
      <Meta />
      <div className="mx-16 box-content flex flex-col items-center gap-5">
        {isLoading ? (
          <Skeleton className="my-5 text-4xl" width={"50%"} height={50} />
        ) : (
          <h2 className="my-5 text-4xl">Overview</h2>
        )}

        {isLoading ? (
          <Skeleton width={"70%"} height={30} />
        ) : (
          <h3 className="text-2xl text-info">Look into {name} tables.</h3>
        )}

        {isLoading ? (
          <Skeleton width={"90%"} height={15} count={5} />
        ) : (
          <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 text-base-content">
            <p className="text-lg leading-relaxed md:text-xl">
              This overview provides a high-level summary of your database
              contents. You can browse available tables, check their structure,
              and prepare to run queries or make updates. Use the tools provided
              to navigate and manage your data efficiently.
            </p>
            <p className="text-lg leading-relaxed md:text-xl">
              Use the navigation tools to view individual tables, inspect
              columns, types, and relationships. This helps you prepare for
              queries or transformations you may need to perform later using the
              query builder or chart tools.
            </p>
            <p className="text-lg leading-relaxed md:text-xl">
              If you're just getting started, take a moment to explore how your
              data is laid out. Knowing your schema makes it easier to craft
              efficient queries and build useful visualizations. Everything you
              need is just a click away.
            </p>
            <p className="text-lg leading-relaxed md:text-xl">
              Ready to dive deeper? Head over to the <strong>Charts</strong> or{" "}
              <strong>Query Builder</strong> sections to begin working with your
              data directly.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Overview;
