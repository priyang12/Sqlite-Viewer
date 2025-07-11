import * as Comlink from "comlink";
import { SqlWorkerAPI } from "../workers/sqlWorker";

const worker = new Worker(new URL("../workers/sqlWorker.ts", import.meta.url), {
  type: "module",
});

const sqlWorkerProxy = Comlink.wrap<SqlWorkerAPI>(worker);

export function getSqlWorker() {
  return sqlWorkerProxy;
}

export function terminateSqlWorker() {
  sqlWorkerProxy.clean?.();
  worker.terminate();
}
