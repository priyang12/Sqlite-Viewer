import React, { useEffect, useState } from "react";
import { SetURLSearchParams } from "react-router-dom";

export const RecentQueryKey = "recentQueries";

export function appendQueryToLocalStorage(newQuery: string) {
  try {
    const raw = localStorage.getItem(RecentQueryKey);
    const existing: string[] = raw ? JSON.parse(raw) : [];
    existing.push(newQuery);

    // Limit to last 10 queries (for now)
    const limited = existing.slice(0, 10);

    localStorage.setItem(RecentQueryKey, JSON.stringify(limited));
  } catch (err) {
    console.error("Failed to update recent queries:", err);
  }
}

// display queries and set URL - done
// Add a "Clear History" button - done
// Limit to last N queries
// Display timestamp with each query and make key on runtime with db name.
// Make items clickable to re-run queries -done

const HistoryPanel: React.FC<{ setSearchParams: SetURLSearchParams }> = ({
  setSearchParams,
}) => {
  const [queries, setQueries] = useState<string[]>([]);
  const [reloadKey, setReloadKey] = useState(0);

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

  // this is just for temp
  useEffect(() => {
    const raw = localStorage.getItem("recentQueries");
    const parsed = raw ? JSON.parse(raw) : [];
    setQueries(parsed);
  }, [reloadKey]);

  const runQuery = (query: string) => {
    setSearchParams({ query: encodeURIComponent(query) });
  };

  const triggerReload = () => {
    setReloadKey((prev) => prev + 1); // Forces effect to run again
  };

  const clearHistory = () => {
    localStorage.removeItem(RecentQueryKey);
    setQueries([]);
  };

  return (
    <section className="h-full w-full rounded-lg border-2 border-solid border-primary bg-base-100 p-4 shadow-md">
      <div className="flex justify-between">
        <h2 className="mb-3 text-lg font-semibold text-base-content">
          Recent Queries
          <button
            onClick={triggerReload}
            title="Reload"
            className="text-base-content transition hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582M20 20v-5h-.581M5.5 8.5A7.978 7.978 0 0112 4c4.418 0 8 3.582 8 8s-3.582 8-8 8a7.978 7.978 0 01-6.5-3.5"
              />
            </svg>
          </button>
        </h2>

        <button
          onClick={clearHistory}
          className="btn btn-outline btn-error btn-sm ml-2"
        >
          Clear All
        </button>
      </div>

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
