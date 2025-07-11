import * as Comlink from "comlink";
import { useRef } from "react";
import { SqlWorkerAPI } from "../workers/sqlWorker";
import { getSqlWorker } from "../workers/sqlWorkerClient";

export const useSqlWorker = () => {
  const workerRef = useRef<Comlink.Remote<SqlWorkerAPI> | null>(getSqlWorker());

  // replaced for with singleton fn due to Comlink.wrap causing race issue.

  // useEffect(() => {
  //   const worker = new Worker(
  //     new URL("../workers/sqlWorker.ts", import.meta.url),
  //     {
  //       type: "module",
  //     },
  //   );

  //   const proxy = Comlink.wrap<SqlWorkerAPI>(worker);
  //   workerRef.current = proxy;
  // }, []);

  return workerRef;
};
