import { useParams } from "react-router-dom";

const DatabaseTable = () => {
  const { table } = useParams();
  return (
    <div className="mx-16 box-content flex flex-col items-center gap-5">
      <h2 className="my-5 self-start text-xl">Table : {table}</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
        recusandae deleniti, blanditiis totam dolorem suscipit cupiditate
        dignissimos! Modi sequi saepe hic praesentium quos repellendus sint
        similique consectetur necessitatibus repudiandae neque cumque totam in
        ducimus a, ipsum nam reprehenderit maiores sit rem ad quam eum
        consequatur minima? Ipsa deserunt ipsam nihil.
      </p>
    </div>
  );
};

export default DatabaseTable;
