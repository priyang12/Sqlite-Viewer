import * as Comlink from "comlink";
import initSqlJs from "sql.js";
import type { Database, SqlJsStatic } from "sql.js";

import sqlWasm from "sql.js/dist/sql-wasm.wasm?url";

export interface SqlWorkerAPI {
  loadDatabase: (file: File) => Promise<{ result: string }>;
  clean: () => void;
}

let SQL: SqlJsStatic | undefined;
let db: Database | undefined;

const api: SqlWorkerAPI = {
  async loadDatabase(file: File) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      // Initialize SQL.js if not already
      if (!SQL) {
        SQL = await initSqlJs({
          locateFile: () => sqlWasm,
        });
      }

      db = new SQL.Database(new Uint8Array(arrayBuffer));
      return { result: "success" };
    } catch (error) {
      console.error("Failed to load DB in worker:", error);

      return { result: "failure" };
    }
  },
  clean() {
    db?.close();
  },
};

Comlink.expose(api);
