import { useEffect, useState } from "react";
import Skeleton from "../../../Components/Skeleton";

const Overview = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    () => clearTimeout(loadingTimer);
  });

  return (
    <div className="mx-16 box-content flex flex-col items-center gap-5">
      {isLoading ? (
        <Skeleton className="my-5 text-4xl" width={"50%"} height={50} />
      ) : (
        <h2 className="my-5 text-4xl">Overview</h2>
      )}

      {isLoading ? (
        <Skeleton width={"70%"} height={30} />
      ) : (
        <h3 className="text-2xl text-info">
          Serach for your Tables in DB and change at your need.
        </h3>
      )}

      {isLoading ? (
        <Skeleton width={"90%"} height={15} count={5} />
      ) : (
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
          recusandae deleniti, blanditiis totam dolorem suscipit cupiditate
          dignissimos! Modi sequi saepe hic praesentium quos repellendus sint
          similique consectetur necessitatibus repudiandae neque cumque totam in
          ducimus a, ipsum nam reprehenderit maiores sit rem ad quam eum
          consequatur minima? Ipsa deserunt ipsam nihil.
        </p>
      )}
    </div>
  );
};

export default Overview;
