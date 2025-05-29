import React from "react";

type BuilderComponentType = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

// Current ability to build query.
// column selection, select table, where Condition.
// ex: SELECT col1, col2 FROM table_name WHERE col3 = 'value'

const BuilderComponent: React.FC<BuilderComponentType> = ({
  query,
  setQuery,
}) => {
  console.log(query);

  return (
    <div>
      <div className="mb-4 resize-none rounded border border-gray-300 p-3 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500">
        {query}
      </div>
    </div>
  );
};
export default BuilderComponent;
