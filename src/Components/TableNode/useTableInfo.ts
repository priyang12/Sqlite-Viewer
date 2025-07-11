import { useEffect, useState } from "react";
import { columnData } from "../../Utils/tableUtils";
import { useErrorBoundary } from "react-error-boundary";
import { useSqlWorker } from "../../Hooks/useSqlWorker";

export type TableInfo = {
  [columnName: string]: {
    type: string;
    pk: number;
  };
};

export function useTableInfo(tableName: string) {
  const workerRef = useSqlWorker();
  const [tableInfo, setTableInfo] = useState<TableInfo>();
  const { showBoundary } = useErrorBoundary();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        if (mounted) {
          const result = await workerRef.current?.getTableProperties(tableName);
          if (result) {
            const info = columnData(result);
            setTableInfo(info);
          }
        }
      } catch (err) {
        showBoundary(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      setTableInfo(undefined);
    };
  }, [tableName, showBoundary]);

  return { tableInfo, loading };
}
