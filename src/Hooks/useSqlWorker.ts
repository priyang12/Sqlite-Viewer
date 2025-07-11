import * as Comlink from "comlink";
import { useEffect, useRef } from "react";
import { SqlWorkerAPI } from "../workers/sqlWorker";

export const useSqlWorker = () => {
  const workerRef = useRef<Comlink.Remote<SqlWorkerAPI> | null>(null);

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/sqlWorker.ts", import.meta.url),
      {
        type: "module",
      },
    );

    const proxy = Comlink.wrap<SqlWorkerAPI>(worker);
    workerRef.current = proxy;

    return () => {
      proxy.clean?.(); //  clean up sql.js memory
      worker.terminate(); // stop the worker thread
    };
  }, []);

  return workerRef;
};
