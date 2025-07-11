import * as Comlink from "comlink";
import initSqlJs from "sql.js";
import type { Database, QueryExecResult, SqlJsStatic } from "sql.js";

import sqlWasm from "sql.js/dist/sql-wasm.wasm?url";
import { queries } from "../Utils/queriesUtils";

type QueryResponse = QueryExecResult[] | undefined;
export interface SqlWorkerAPI {
  SQL: SqlJsStatic | undefined;
  db: Database | undefined;
  loadDatabase: (file: File) => Promise<{ result: string }>;
  exeQuery: (query: string) => QueryResponse;
  getAllTables: () => string[] | undefined;
  getTableProperties: (tableName: string) => QueryResponse;
  getForeignKeys: (tableName: string) => QueryResponse;
  getTableColumns: (tableName: string) => QueryResponse;
  clean: () => void;
}

const api: SqlWorkerAPI = {
  db: undefined,
  SQL: undefined,
  async loadDatabase(file: File) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      // Initialize SQL.js if not already
      if (!this.SQL) {
        this.SQL = await initSqlJs({
          locateFile: () => sqlWasm,
        });
      }
      this.db = new this.SQL.Database(new Uint8Array(arrayBuffer));
      return { result: "success" };
    } catch (error) {
      console.error("Failed to load DB in worker:", error);
      return { result: "failure" };
    }
  },
  getAllTables() {
    if (this.db) {
      const result = this.db?.exec(queries.table.allTables);
      const tables = result[0].values.map((r) => (r[0] ? r[0].toString() : ""));
      return tables;
    }
  },
  getTableProperties(tableName) {
    const result = this.db?.exec(queries.table.properties(tableName));
    return result;
  },
  getForeignKeys(tableName) {
    const result = this.db?.exec(`PRAGMA foreign_key_list(${tableName});`);
    return result;
  },
  getTableColumns(tableName) {
    const result = this.db?.exec(`PRAGMA table_info(${tableName});`);
    return result;
  },
  exeQuery(query) {
    return this.db?.exec(query);
  },
  clean() {
    this.db?.close();
  },
};

Comlink.expose(api);
