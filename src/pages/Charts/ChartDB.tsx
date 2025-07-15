import { useEffect } from "react";
import { useGetDBContext } from "../../Context/DBContext";
import { useSqlWorker } from "../../Hooks/useSqlWorker";
import { Link, useParams } from "react-router-dom";
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

function QueryLayout() {
  const workerRef = useSqlWorker();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const fetchTables = async (): Promise<string[] | undefined> => {
    const result = await workerRef.current?.getAllTables();
    if (result) return result;
  };

  const fetchForeignKeys = async (
    tables: string[],
  ): Promise<{ source: string; foreignKeys: any[] }[]> => {
    return await Promise.all(
      tables.map(async (tableName) => {
        const foreignKeys = await workerRef.current?.getForeignKeys(tableName);
        const rows = foreignKeys?.[0]?.values || [];
        return { source: tableName, foreignKeys: rows };
      }),
    );
  };

  const buildNodes = (tables: string[]): Node[] => {
    return tables.map((tableName, index) => ({
      id: tableName,
      type: "tableNode",
      position: { x: index * 250, y: 100 },
      data: { tableName },
    }));
  };

  const buildEdges = (
    foreignData: { source: string; foreignKeys: any[] }[],
    tables: string[],
  ): Edge[] => {
    const edges: Edge[] = [];
    foreignData.forEach((table) => {
      if (table.foreignKeys.length === 0) return;
      table.foreignKeys.forEach((fk, idx) => {
        const referencedTable = fk[2]; // column index 2 is the referenced table name
        const fromColumn = fk[3]; // column in this (source) table
        const toColumn = fk[4]; // column in the referenced (target) table
        if (referencedTable && tables.includes(referencedTable?.toString())) {
          edges.push({
            id: `edge-${table.source}-${referencedTable}-${idx}`,
            source: table.source,
            target: referencedTable?.toString() || "",
            sourceHandle: `source-${fromColumn}`,
            targetHandle: `target-${toColumn}`,
            animated: true,
            style: { stroke: "#888" },
          });
        }
      });
    });
    return edges;
  };

  useEffect(() => {
    const loadChart = async () => {
      if (!workerRef.current) return;
      const tables = await fetchTables();
      if (tables) {
        const foreignData = await fetchForeignKeys(tables);
        const newNodes = buildNodes(tables);
        const newEdges = buildEdges(foreignData, tables);
        setNodes(newNodes as any);
        setEdges(newEdges as any);
      }
    };

    loadChart();
  }, [workerRef]);

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

function Meta() {
  const { name } = useParams();

  const readableTitle = name
    ? `Schema Chart for "${name}" | Your Databases`
    : "Database Schema Chart | Your Databases";

  const description = name
    ? `Visualize the relationships between tables in the "${name}" database. This interactive chart helps you understand table connections via foreign keys.`
    : "View an interactive schema chart to explore table relationships in your database.";

  return (
    <>
      <title>{readableTitle}</title>
      <meta name="description" content={description} />
    </>
  );
}

function ChartDB() {
  const { name } = useParams();
  const { dbLoaded } = useGetDBContext();

  return (
    <>
      <Meta />
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
          {dbLoaded ? <QueryLayout /> : <Loading />}
        </div>
      </div>
    </>
  );
}

export default ChartDB;
