import { useParams, Link } from "react-router-dom";
import {
  TableCellsIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

export default function DBHome() {
  const { name } = useParams();

  const tools = [
    {
      label: "Tables",
      icon: <TableCellsIcon className="h-28 w-28 text-primary" />,
      link: `/db/${name}/tables`,
    },
    {
      label: "Charts",
      icon: <ChartBarIcon className="h-28 w-28 text-secondary" />,
      link: `/db/${name}/charts`,
    },
    {
      label: "Query Builder",
      icon: <WrenchScrewdriverIcon className="h-28 w-28 text-accent" />,
      link: `/db/${name}/queryBuilder`,
    },
  ];

  return (
    <div className="mx-auto h-full max-w-6xl space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">Database: {name}</h1>
        <p className="mt-1 text-sm text-base-content">
          Choose a tool to explore your data
        </p>
      </div>
      <div className="flex h-3/4 justify-center bg-base-200">
        <div className="grid grid-cols-1 gap-6 self-center sm:grid-cols-3">
          {tools.map((tool) => (
            <Link
              to={tool.link}
              key={tool.label}
              className="card bg-base-100 shadow-md transition hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="card-body items-center text-center">
                <div className="mb-4">{tool.icon}</div>
                <h2 className="card-title">{tool.label}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
