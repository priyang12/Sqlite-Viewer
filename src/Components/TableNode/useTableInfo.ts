import { useEffect, useState } from "react";
import { Database } from "sql.js";
import { queries } from "../../Utils/queriesUtils";
import { columnData } from "../../Utils/tableUtils";

export type TableInfo = {
  [columnName: string]: {
    type: string;
    pk: number;
  };
};

export function useTableInfo(db: Database, tableName: string) {
  const [tableInfo, setTableInfo] = useState<TableInfo>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    try {
      const result = db.exec(queries.table.properties(tableName));
      const info = columnData(result);
      if (mounted) setTableInfo(info);
    } catch (err) {
      // optionally handle error
    } finally {
      if (mounted) setLoading(false);
    }

    return () => {
      mounted = false;
      setTableInfo(undefined);
    };
  }, [db, tableName]);

  return { tableInfo, loading };
}
