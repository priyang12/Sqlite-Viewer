import { createObject, getTableQuery } from "../tableUtils";

describe.skip("createObject function", () => {
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

describe("getTableQuery function", () => {
  it("should return the correct query for a given table name", () => {
    const tableName = "yourTableName";
    const expectedQuery = `WITH columns AS (
        SELECT name
        FROM pragma_table_info('yourTableName')
      )
      SELECT 
        'SELECT ' || GROUP_CONCAT('substr(' || name || ', 1, 100) AS ' || name) AS query
      FROM columns;`;
    expect(getTableQuery(tableName)).toEqual(expectedQuery);
  });

  it("should return the correct query for another table name", () => {
    const tableName = "anotherTableName";
    const expectedQuery = `WITH columns AS (
        SELECT name
        FROM pragma_table_info('anotherTableName')
      )
      SELECT 
        'SELECT ' || GROUP_CONCAT('substr(' || name || ', 1, 100) AS ' || name) AS query
      FROM columns;`;
    expect(getTableQuery(tableName)).toEqual(expectedQuery);
  });
});
