import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const RecentQueryKey = "recentQueries";

const LimitedQueries = 10;

// display queries and set URL - done
// Add a "Clear History" button - done
// Limit to last N queries - done
// Display timestamp with each query
// Make items clickable to re-run queries -done

// seal the logic into custom hook and let parent component control the state.
// this avoid the adhoc re-rendering when new query is added.
export const useRecentQueries = () => {
  const { name: dbname } = useParams<{ name: string }>();
  const key = `${dbname}-${RecentQueryKey}`;

  const [queries, setQueries] = useState<string[]>([]);

  const loadFromStorage = useCallback(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setQueries(parsed);
        } else {
          throw new Error("Malformed recent query data.");
        }
      } else {
        setQueries([]);
      }
    } catch (err) {
      console.error("Failed to parse recent queries from localStorage:", err);
      throw new Error(
        "Failed to load recent queries. Try again or clear your storage.",
      );
    }
  }, [key]);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const addQuery = useCallback(
    (newQuery: string) => {
      try {
        const unique = [newQuery, ...queries.filter((q) => q !== newQuery)];
        const limited = unique.slice(0, LimitedQueries);
        setQueries(limited);
        localStorage.setItem(key, JSON.stringify(limited));
      } catch (err) {
        console.error("Failed to save recent query:", err);
      }
    },
    [key, queries],
  );

  const clearQueries = useCallback(() => {
    localStorage.removeItem(key);
    setQueries([]);
  }, [key]);

  return {
    queries,
    addQuery,
    clearQueries,
    reload: loadFromStorage,
  };
};

const HistoryPanel: React.FC<{
  queries: string[];
  clearHistory: () => void;
  executeQuery: (query: string) => void;
}> = ({ queries, clearHistory, executeQuery }) => {
  return (
    <section className="h-full w-full rounded-lg border-2 border-solid border-primary bg-base-100 p-4 shadow-md">
      <div className="flex justify-between">
        <h2 className="mb-3 text-lg font-semibold text-base-content">
          Showing {queries.length} of {LimitedQueries} recent queries
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
                  onClick={() => executeQuery(query)}
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
