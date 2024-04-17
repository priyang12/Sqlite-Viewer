import { render } from "@testing-library/react";
import { DBProvider, useGetDBContext } from "../DBContext";

// Mock useDefaultGetDB and useIndexedDB hooks
vi.mock("../../Hooks/useDefaultGetDB", () => ({
  useDefaultGetDB: vi.fn().mockReturnValue({ db: true }),
}));

vi.mock("../../Hooks/useIndexedDB", () => ({
  useIndexedDB: vi.fn().mockReturnValue({ indexedDB: true }),
}));

// Test the DBProvider component
it("provides database context to its children", () => {
  const ChildComponent = () => {
    const { db, indexedDB } = useGetDBContext();

    return (
      <div>
        <h1>test</h1>
        {db ? <span>Default DB</span> : null}
        {indexedDB ? <span>Indexed DB</span> : null}
      </div>
    );
  };

  const { getByText } = render(
    <DBProvider>
      <ChildComponent />
    </DBProvider>
  );

  expect(getByText("Default DB")).toBeTruthy(); // Check if mockDB is rendered
  expect(getByText("Indexed DB")).toBeTruthy(); // Check if mockIndexedDB is rendered
});
