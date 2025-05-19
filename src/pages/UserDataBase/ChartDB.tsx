import { useMemo } from "react";
import { useGetDBContext } from "../../Context/DBContext";
import { useParams } from "react-router-dom";
import { queries } from "../../Utils/queriesUtils";
import { Database } from "sql.js";
import { Background, Controls, Node, ReactFlow } from "@xyflow/react";
import Loading from "../../Components/Loading";
import TableNode from "../../Components/TableNode/TableNode";
import "@xyflow/react/dist/style.css";

const nodeTypes = {
  tableNode: TableNode,
};

function QueryLayout({ db }: { db: Database }) {
  const tables = useMemo(() => {
    const result = db.exec(queries.table.allTables);
    return result[0]?.values.map((r) => r[0]?.toString() || "") || [];
  }, [db]);

  const nodes: Node[] = tables.map((tableName, index) => ({
    id: tableName,
    type: "tableNode",
    position: { x: index * 250, y: 100 },
    data: { db, tableName },
  }));

  return (
    <div style={{ width: "100%", height: "90vh" }}>
      <ReactFlow nodes={nodes} edges={[]} nodeTypes={nodeTypes} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

function ChartDB() {
  const { name } = useParams();
  const { db } = useGetDBContext();

  return (
    <div>
      <h1>Chart : {name}</h1>
      {typeof db !== "undefined" ? <QueryLayout db={db} /> : <Loading />}
    </div>
  );
}

export default ChartDB;
