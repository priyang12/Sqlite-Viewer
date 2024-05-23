import { queryType } from "../../Hooks/useSqlQueries";
import { createObject, getTableQuery } from "../tableUtils";
import { columnData } from "../tableUtils";

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

describe.skip("getTableQuery function", () => {
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

describe("columnData", () => {
  it("should transform table information result into the expected object", () => {
    const tableInfoResult = [
      {
        columns: ["cid", "name", "type", "notnull", "dflt_value", "pk"],
        values: [
          [0, "id", "INTEGER", 1, null, 1],
          [1, "name", "TEXT", 1, null, 0],
          [2, "age", "INTEGER", 0, null, 0],
        ],
      },
    ];

    const expectedResult = {
      id: { type: "INTEGER", pk: 1 },
      name: { type: "TEXT", pk: 0 },
      age: { type: "INTEGER", pk: 0 },
    };

    expect(columnData(tableInfoResult)).toEqual(expectedResult);
  });

  it("should handle an empty values array", () => {
    const tableInfoResult = [
      {
        columns: ["cid", "name", "type", "notnull", "dflt_value", "pk"],
        values: [],
      },
    ];

    const expectedResult = {};

    expect(columnData(tableInfoResult)).toEqual(expectedResult);
  });

  it("should handle missing name, type, or pk columns gracefully", () => {
    const tableInfoResult = [
      {
        columns: ["cid", "name", "type", "notnull"],
        values: [
          [0, "id", "INTEGER", 1],
          [1, "name", "TEXT", 1],
          [2, "age", "INTEGER", 0],
        ],
      },
    ];

    const expectedResult = {
      id: { type: "INTEGER", pk: undefined },
      name: { type: "TEXT", pk: undefined },
      age: { type: "INTEGER", pk: undefined },
    };

    expect(columnData(tableInfoResult)).toEqual(expectedResult);
  });

  it("should convert null or undefined names to string", () => {
    const tableInfoResult = [
      {
        columns: ["cid", "name", "type", "notnull", "dflt_value", "pk"],
        values: [
          [0, null, "INTEGER", 1, null, 1],
          [1, undefined, "TEXT", 1, null, 0],
        ],
      },
    ] as queryType;

    const expectedResult = {
      null: { type: "INTEGER", pk: 1 },
      undefined: { type: "TEXT", pk: 0 },
    };

    expect(columnData(tableInfoResult)).toEqual(expectedResult);
  });

  it("should handle a large number of rows efficiently", () => {
    const columns = ["cid", "name", "type", "notnull", "dflt_value", "pk"];
    const values = Array.from({ length: 1000 }, (_, i) => [
      i,
      `name${i}`,
      "INTEGER",
      1,
      null,
      i % 2,
    ]);

    const tableInfoResult = [{ columns, values }];

    const result = columnData(tableInfoResult);

    expect(Object.keys(result).length).toBe(1000);
    expect(result["name0"]).toEqual({ type: "INTEGER", pk: 0 });
    expect(result["name999"]).toEqual({ type: "INTEGER", pk: 1 });
  });
});
