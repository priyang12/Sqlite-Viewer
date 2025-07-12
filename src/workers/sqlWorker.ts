import * as Comlink from "comlink";
import initSqlJs from "sql.js";
import sqlWasm from "sql.js/dist/sql-wasm.wasm?url";
import { queries } from "../Utils/queriesUtils";

import type { Database, QueryExecResult, SqlJsStatic } from "sql.js";

export type QueryResponse = QueryExecResult[] | undefined;
export interface SqlWorkerAPI {
  SQL: SqlJsStatic | undefined;
  db: Database | undefined;
  loadDatabase: (file: File) => Promise<{ result: string }>;
  preFetchData: () => void;
  exeQuery: (query: string) => QueryResponse;
  getAllTables: () => string[] | undefined;
  getTableProperties: (tableName: string) => QueryResponse;
  getForeignKeys: (tableName: string) => QueryResponse;
  getTableColumns: (tableName: string) => QueryResponse;
  runDataBaseQueries: (queries: string[]) => Promise<[QueryExecResult[]]>;
  clean: () => void;
}

let cache: Map<string, QueryResponse> = new Map();

const api: SqlWorkerAPI = {
  db: undefined,
  SQL: undefined,
  async loadDatabase(file: File) {
    cache.clear();
    try {
      const arrayBuffer = await file.arrayBuffer();
      // Initialize SQL.js if not already
      if (!this.SQL) {
        this.SQL = await initSqlJs({
          locateFile: () => sqlWasm,
        });
      }
      this.db = new this.SQL.Database(new Uint8Array(arrayBuffer));
      this.preFetchData();
      return { result: "success" };
    } catch (error) {
      console.error("Failed to load DB in worker:", error);
      return { result: "failure" };
    }
  },
  async preFetchData() {
    const tables = this.getAllTables();
    if (!tables || !Array.isArray(tables)) return;
    console.log("Preloading schema for tables:", tables);

    await Promise.all(
      tables.map(async (table) => {
        this.getTableProperties(table);
        this.getForeignKeys(table);
        this.getTableColumns(table); // optional: also preload columns
      }),
    );
    console.log("Prefetch complete.");
  },
  exeQuery(query) {
    // this similar may in future we can add specific keys for each queries.
    if (cache.has(query)) {
      return cache.get(query);
    }
    const result = this.db?.exec(query);
    if (result) {
      cache.set(query, result);
    }
    return result;
  },

  getAllTables() {
    const result = this.exeQuery(queries.table.allTables);
    if (result) {
      const tables = result[0].values.map((r) => (r[0] ? r[0].toString() : ""));
      return tables;
    }
  },
  getTableProperties(tableName) {
    const result = this.exeQuery(queries.table.properties(tableName));
    return result;
  },
  getForeignKeys(tableName) {
    const result = this.exeQuery(queries.table.foreignKey(tableName));
    return result;
  },
  getTableColumns(tableName) {
    const result = this.exeQuery(queries.table.properties(tableName));
    return result;
  },
  async runDataBaseQueries(queries) {
    const results = (await Promise.all(
      queries.map(
        (query) =>
          new Promise((resolve) => {
            const result = this.exeQuery(query);
            resolve(result);
          }),
      ),
    )) as [QueryExecResult[]];
    return results;
  },

  clean() {
    cache.clear();
    this.db?.close();
  },
};

Comlink.expose(api);
