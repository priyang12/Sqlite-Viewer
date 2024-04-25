import { useParams } from "react-router-dom";

const DatabaseTable = () => {
  const { table } = useParams();
  return (
    <div className="flex flex-col items-center mx-16 gap-5 box-content">
      <h2 className="text-xl my-5 self-start">Table : {table}</h2>
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
