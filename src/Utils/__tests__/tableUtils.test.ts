import { createObject } from "../tableUtils";

describe("createObject function", () => {
  it("should return an object with properties based on tableHead and corresponding values from row", () => {
    const row = ["John", 30, "New York"];
    const tableHead = ["Name", "Age", "Location"];
    const expectedObject = {
      Name: "John",
      Age: 30,
      Location: "New York",
    };
    expect(createObject(row, tableHead)).toEqual(expectedObject);
  });

  it("should return an empty object if tableHead is undefined", () => {
    const row = ["John", 30, "New York"];
    const tableHead = undefined;
    const expectedObject = {};
    expect(createObject(row, tableHead)).toEqual(expectedObject);
  });

  it("should return an object with undefined values for missing properties in row", () => {
    const row = ["John", 30];
    const tableHead = ["Name", "Age", "Location"];
    const expectedObject = {
      Name: "John",
      Age: 30,
      Location: undefined,
    };
    expect(createObject(row, tableHead)).toEqual(expectedObject);
  });

  it("should return an object with null values if row contains null values", () => {
    const row = ["John", null, "New York"];
    const tableHead = ["Name", "Age", "Location"];
    const expectedObject = {
      Name: "John",
      Age: null,
      Location: "New York",
    };
    expect(createObject(row, tableHead)).toEqual(expectedObject);
  });
});
