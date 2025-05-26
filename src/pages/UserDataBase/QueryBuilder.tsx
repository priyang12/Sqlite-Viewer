import React from "react";
import { useGetDBContext } from "../../Context/DBContext";
import { QueryExecResult } from "sql.js";
import { useSearchParams } from "react-router-dom";

const QueryBuilder = () => {
  const { db } = useGetDBContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = React.useState(
    searchParams.get("query") ?? "SELECT * FROM (TableName);",
  );
  const [result, setResult] = React.useState<QueryExecResult[]>();
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    const parQuery = searchParams.get("query");
    if (db && parQuery) {
      try {
        const res = db.exec(parQuery); // Returns an array of results
        setResult(res);
        setError(undefined);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
        setResult(undefined);
      }
    }
  }, [db, searchParams]);

  const executeQuery = () => {
    setSearchParams({ query: encodeURIComponent(query) });
  };

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Query</h1>
      <textarea
        className="mb-4 h-40 w-full resize-none rounded border border-gray-300 p-3 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Write your SQL here..."
      />
      <button
        onClick={executeQuery}
        className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
      >
        Run Query
      </button>
      {error && (
        <div className="mt-4 font-mono text-red-500">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && result.length > 0 ? (
        <div className="mt-6">
          <h2 className="mb-2 text-xl font-semibold">Result</h2>
          <div className="overflow-auto rounded border border-gray-300">
            <table className="min-w-full text-left font-mono text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {result[0].columns.map((col) => (
                    <th key={col} className="border-b px-4 py-2">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result[0].values.map((row, idx) => (
                  <tr key={idx} className="odd:bg-white even:bg-gray-50">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="border-b px-4 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {result && result.length === 0 && (
        <div className="mt-4 font-mono text-gray-600">
          Query executed successfully, no results returned.
        </div>
      )}
    </div>
  );
};

export default QueryBuilder;
