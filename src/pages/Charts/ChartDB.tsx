import { useMemo } from "react";
import { useGetDBContext } from "../../Context/DBContext";
import { Link, useParams } from "react-router-dom";
import { queries } from "../../Utils/queriesUtils";
import { Database } from "sql.js";
import {
  Background,
  Controls,
  Edge,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
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

  const initialNodes: Node[] = useMemo(() => {
    return tables.map((tableName, index) => ({
      id: tableName,
      type: "tableNode",
      position: { x: index * 250, y: 100 },
      data: { db, tableName },
    }));
  }, [tables, db]);

  const initialEdges: Edge[] = useMemo(() => {
    const result: Edge[] = [];

    tables.forEach((tableName) => {
      const foreignKeys = db.exec(`PRAGMA foreign_key_list(${tableName});`);

      if (foreignKeys.length === 0) return;

      const rows = foreignKeys[0].values;
      rows.forEach((fk, idx) => {
        const referencedTable = fk[2]; // column index 2 is the referenced table name
        const fromColumn = fk[3]; // column in this (source) table
        const toColumn = fk[4]; // column in the referenced (target) table

        if (referencedTable && tables.includes(referencedTable?.toString())) {
          result.push({
            id: `edge-${tableName}-${referencedTable}-${idx}`,
            source: tableName,
            target: referencedTable?.toString() || "",
            sourceHandle: `source-${fromColumn}`,
            targetHandle: `target-${toColumn}`,
            animated: true,
            style: { stroke: "#888" },
          });
        }
      });
    });

    return result;
  }, [tables, db]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ width: "100%", height: "90vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        nodesDraggable={true}
        fitView
      >
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
    <div className="flex h-full flex-col bg-base-200 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-base-content">
          Chart: <span className="font-mono text-info">{name}</span>
        </h1>
        <Link
          to=".."
          relative="route"
          className="btn btn-info btn-sm text-white"
        >
          ← Go Back
        </Link>
      </div>

      <div className="card min-h-0 flex-1 overflow-hidden bg-base-100 shadow-lg">
        {typeof db !== "undefined" ? <QueryLayout db={db} /> : <Loading />}
      </div>
    </div>
  );
}

export default ChartDB;
