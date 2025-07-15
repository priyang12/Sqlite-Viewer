import { useParams, Link } from "react-router-dom";
import {
  TableCellsIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

function Meta() {
  const { name } = useParams();

  return (
    <>
      <title>{name ? `${name} | Database Tools` : "Database Tools"}</title>
      <meta
        name="description"
        content={`Explore tables, charts, and query builder tools for the "${name}" database.`}
      />
    </>
  );
}

export default function DBHome() {
  const { name } = useParams();

  const tools = [
    {
      label: "Tables",
      icon: (
        <TableCellsIcon className="h-10 w-10 text-primary md:h-28 md:w-28" />
      ),
      link: `/db/${name}/tables`,
    },
    {
      label: "Charts",
      icon: (
        <ChartBarIcon className="h-10 w-10 text-secondary md:h-28 md:w-28" />
      ),
      link: `/db/${name}/charts`,
    },
    {
      label: "Query Builder",
      icon: (
        <WrenchScrewdriverIcon className="h-10 w-10 text-accent md:h-28 md:w-28" />
      ),
      link: `/db/${name}/queryBuilder`,
    },
  ];

  return (
    <>
      <Meta />
      <div className="mx-auto h-full max-w-6xl space-y-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold text-primary">Database: {name}</h1>
          <p className="text-base text-base-content">
            Choose a tool to explore your data
          </p>
        </div>
        <div className="flex h-3/4 flex-col justify-evenly overflow-scroll bg-base-200 md:overflow-auto">
          <div className="mt-4 flex h-fit justify-center gap-4">
            <Link
              to="/"
              className="btn btn-outline btn-primary btn-sm md:btn-md"
            >
              Go to Home
              <span>
                <HomeIcon className="h-5 w-5 text-primary hover:text-base-200 md:h-10 md:w-10" />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 self-center p-2 md:grid-cols-3">
            {tools.map((tool) => (
              <Link
                to={tool.link}
                key={tool.label}
                className="card bg-base-100 shadow-md transition hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="card-body  items-center text-center">
                  <div className="mb-4">{tool.icon}</div>
                  <h2 className="card-title">{tool.label}</h2>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
