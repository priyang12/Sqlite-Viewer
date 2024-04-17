import { getDBKey } from "../dateUtils"; // Replace 'yourFile.js' with the actual file name

// Define a test suite
it("getDBKey function tests", () => {
  const file = new File(["content"], "example.txt", {
    type: "text/plain",
    lastModified: Date.now(),
  });

  const key = getDBKey(file);

  expect(key).toBe("example.txt-" + new Date(file.lastModified).toISOString());
});
