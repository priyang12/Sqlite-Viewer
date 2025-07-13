import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const RecentQueryKey = "recentQueries";

const LimitedQueries = 10;

type storedObject = {
  query: string;
  timestamp: string;
};

// seal the logic into custom hook and let parent component control the state.
// this avoid the adhoc re-rendering when new query is added.
// may be we can useImperativeHandle to mutation from parent and let child consume useRecentQueries.
export const useRecentQueries = () => {
  const { name: dbname } = useParams<{ name: string }>();
  const key = `${dbname}-${RecentQueryKey}`;

  const [queries, setQueries] = useState<storedObject[]>([]);

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
    (obj: storedObject) => {
      try {
        const unique = [
          obj,
          ...queries.filter((item) => item.query !== obj.query),
        ];
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
  queries: storedObject[];
  clearHistory: () => void;
  executeQuery: (query: string) => void;
}> = ({ queries, clearHistory, executeQuery }) => {
  const scrollToPageBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

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
          {queries.map((item, index) => {
            const timestamp = new Date(item.timestamp).toLocaleString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });

            return (
              <li
                key={index}
                className="flex items-center justify-between rounded bg-base-200 px-3 py-2 transition-colors hover:bg-base-300"
              >
                <div className="flex flex-col">
                  <code className="text-sm text-base-content">
                    {item.query}
                  </code>
                  <span className="text-xs text-base-content/50">
                    {timestamp}
                  </span>
                </div>

                <div className="flex items-center">
                  <div className="divider divider-horizontal" />
                  <button
                    className="h-[30px] rounded border border-blue-600 px-2 py-1 text-sm text-blue-600 hover:bg-red-50"
                    onClick={() => {
                      scrollToPageBottom();
                      executeQuery(item.query);
                    }}
                  >
                    Run
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default HistoryPanel;
