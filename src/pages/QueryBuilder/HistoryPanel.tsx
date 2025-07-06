import React, { useEffect, useState } from "react";
import { SetURLSearchParams } from "react-router-dom";

export const RecentQueryKey = "recentQueries";

// display queries and set URL - done
// Add a "Clear History" button
// Limit to last N queries
// Display timestamp with each query
// Make items clickable to re-run queries

const HistoryPanel: React.FC<{ setSearchParams: SetURLSearchParams }> = ({
  setSearchParams,
}) => {
  const [queries, setQueries] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RecentQueryKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setQueries(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to parse recent queries from localStorage:", err);
      throw Error(
        "Failed to get queries from storage. try again or clean the storage.",
      );
    }
  }, []);

  const runQuery = (query: string) => {
    setSearchParams({ query: encodeURIComponent(query) });
  };

  return (
    <section className="h-full w-full rounded-lg border-2 border-solid border-primary bg-base-100 p-4 shadow-md">
      <h2 className="mb-3 text-lg font-semibold text-base-content">
        Recent Queries
      </h2>

      {queries.length === 0 ? (
        <p className="text-sm text-gray-500">No recent queries found.</p>
      ) : (
        <ul className="space-y-2">
          {queries.map((query, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded bg-base-200 px-3 py-2 transition-colors hover:bg-base-300"
            >
              <code className="text-sm text-base-content">{query}</code>
              <div className="flex">
                <div className="divider divider-horizontal" />
                <button
                  className="h-[30px] rounded border border-blue-600 px-2 py-1 text-sm text-blue-600 hover:bg-red-50"
                  onClick={() => runQuery(query)}
                >
                  Run
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default HistoryPanel;
