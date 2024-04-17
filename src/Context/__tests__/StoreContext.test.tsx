import { render } from "@testing-library/react";
import { StoreProvider, useStoreContext } from "../StoreContext";
import { insertDB, removeDb } from "../../Utils/indexDBUtils";

// Mock window.alert
vi.stubGlobal("alert", vi.fn());

// Mock dependencies
vi.mock("../DBContext", () => ({
  useGetDBContext: vi.fn().mockReturnValue({ indexedDB: "mockIndexedDB" }),
}));

vi.mock("../../Hooks/useGetUserDBs", () => ({
  useGetUserDBs: vi.fn().mockReturnValue({
    storedDBs: ["storedDB1", "storedDB2"],
    setStoredDBs: vi.fn(),
  }),
}));

vi.mock("../../Utils/indexDBUtils", () => ({
  insertDB: vi.fn().mockResolvedValue("mockResult"),
  removeDb: vi.fn().mockResolvedValue(true),
}));

let insertFile: (file: File) => Promise<void>;
let removeFile: (fileName: string) => Promise<void>;

const ChildComponent = () => {
  const { Loading, storedDBs, insertUserDB, removeUserDB } = useStoreContext();
  console.log(storedDBs);

  insertFile = insertUserDB;
  removeFile = removeUserDB;
  return (
    <div>
      <span>Loading: {Loading.toString()}</span>
      <ul>
        {storedDBs.map((db, index) => (
          <li key={index}>{db.toString()}</li>
        ))}
      </ul>
    </div>
  );
};

// Test the StoreProvider component
it("provides store context to its children", async () => {
  const { getByText } = render(
    <StoreProvider>
      <ChildComponent />
    </StoreProvider>
  );

  expect(getByText("Loading: false")).toBeTruthy(); // Check if loading state is false
  expect(getByText("storedDB1")).toBeTruthy(); // Check if storedDB1 is rendered
  expect(getByText("storedDB2")).toBeTruthy(); // Check if storedDB2 is rendered
});

// Test insertUserDB function
it("inserts a file into the database", async () => {
  const file = new File(["content"], "example.txt", {
    type: "text/plain",
    lastModified: Date.now(),
  });

  await insertFile(file);

  expect(insertDB).toHaveBeenCalledWith("mockIndexedDB", file);
});

// Test removeUserDB function
it("removes a file from the database", async () => {
  await removeFile("storedDB1");
  expect(removeDb).toHaveBeenCalledWith("mockIndexedDB", "storedDB1");
});
