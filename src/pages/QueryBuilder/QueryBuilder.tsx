import React, { lazy, Suspense, useState } from "react";
import { useGetDBContext } from "../../Context/DBContext";
import { QueryExecResult } from "sql.js";
import { Link, useSearchParams } from "react-router-dom";
import HistoryPanel, { useRecentQueries } from "./Components/HistoryPanel";
import { WrappedErrorBoundary } from "../../Components/ErrorFallbackComponent/ErrorFallbackComponent";
import BuilderComponent from "../../Components/BuilderComponent";
import Loading from "../../Components/Loading";
import { isSelectQuery } from "../../Utils/queriesUtils";

// spite codemirror import
const CodeEditor = lazy(() => import("./Components/CodeEditor"));

const InputQueryComponent: React.FC<{
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  executeQuery: () => void;
}> = ({ query, setQuery, executeQuery }) => {
  return (
    <div className="w-full max-w-4xl rounded-box bg-base-200 p-6 shadow-lg">
      <textarea
        className="mb-4 h-40 w-full rounded border border-gray-300 p-3 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    </div>
  );
};

// shorter Table
const shortTable = 5;
const MAX_LENGTH = 50; // max string length before truncation

function ShortTable({
  result,
  query,
}: {
  result: QueryExecResult[];
  query: string;
}) {
  const truncate = (value: any) => {
    if (typeof value === "string" && value.length > MAX_LENGTH) {
      return value.substring(0, MAX_LENGTH) + "...";
    }
    return value;
  };

  if (!result || result.length === 0 || result[0].values.length === 0) {
    return (
      <div className="alert alert-info mt-6 shadow">
        <span>No results to display.</span>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Resulted Short Table : Limited {shortTable}
        </h2>
        <Link to={`table?query=${query}`} tabIndex={-1}>
          <button className="btn btn-primary btn-sm">Run Full Query</button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-base-300 shadow-sm">
        <table className="table table-zebra text-sm">
          <thead className="bg-base-200">
            <tr>
              {result[0].columns.map((col) => (
                <th key={col} className="px-4 py-2">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result[0].values.map((row, idx) => (
              <tr key={idx}>
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="max-w-xs break-words px-4 py-2">
                    {truncate(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const QueryBuilder = () => {
  const { workerRef, dbLoaded } = useGetDBContext();

  const [searchParams, setSearchParams] = useSearchParams();
  const parQuery = decodeURIComponent(searchParams.get("query") ?? "");
  const [query, setQuery] = React.useState("SELECT * FROM (TableName);");
  const [result, setResult] = React.useState<QueryExecResult[]>();
  const [error, setError] = React.useState<string>();

  const { queries, addQuery, clearQueries } = useRecentQueries();

  // toggle state
  const [useCodeEditor, setUseCodeEditor] = useState(false);

  React.useEffect(() => {
    (async () => {
      if (workerRef?.current && parQuery) {
        const shorterQuery = parQuery.replace(";", ` Limit ${shortTable};`);
        try {
          const res = await workerRef.current.exeQuery(shorterQuery);
          if (res) {
            setResult(res);
            setError(undefined);
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          }
          setResult(undefined);
        }
      }
    })();
  }, [parQuery]);

  const executeQuery = () => {
    // this basic fn to make sure user don't add mutation
    // may add more better lib like node-sql-parser but it will increase the size
    // by significant.

    if (isSelectQuery(query)) {
      // fn for adding it to local storage and syncing the history state.
      setSearchParams({
        query: encodeURIComponent(query),
      });
      addQuery({
        query: query,
        timestamp: new Date().toISOString(),
      });
    } else {
      setError(`InValid Query! only "Select" queries are allowed.`);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div className="flex w-[80vw] justify-between">
        <h1 className="mb-4 text-2xl font-semibold">Query</h1>
        <Link
          to=".."
          relative="route"
          className="btn btn-info btn-sm text-white"
        >
          ← Go Back
        </Link>
      </div>
      <div className="flex w-[80vw] flex-col gap-5 lg:flex-row">
        <div className="w-full">
          {dbLoaded ? (
            <BuilderComponent query={query} setQuery={setQuery} />
          ) : (
            <>Loading Database...</>
          )}

          <div className="flex flex-col lg:flex-row lg:items-center">
            <button
              onClick={() => setUseCodeEditor((prev) => !prev)}
              className="btn btn-outline btn-info mb-4"
            >
              {useCodeEditor ? "Use Visual Input" : "Use SQL Editor"}
            </button>

            {error && (
              <div className="ml-auto font-mono text-red-500">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>

          {!useCodeEditor ? (
            <InputQueryComponent
              query={query}
              setQuery={setQuery}
              executeQuery={executeQuery}
            />
          ) : (
            <Suspense fallback={<Loading />}>
              <CodeEditor
                query={query}
                setQuery={setQuery}
                executeQuery={executeQuery}
              />
            </Suspense>
          )}

          {result && result.length > 0 ? (
            // replace parQuery to query once populating the data is done.
            <ShortTable result={result} query={parQuery} />
          ) : null}
        </div>
        <div className="h-fit rounded border border-base-300 bg-base-200 p-4 shadow-sm">
          <WrappedErrorBoundary>
            <HistoryPanel
              executeQuery={(query) =>
                setSearchParams({ query: encodeURIComponent(query) })
              }
              queries={queries}
              clearHistory={clearQueries}
            />
          </WrappedErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default QueryBuilder;
