import { describe, it, expect } from "vitest";
import { isSelectQuery } from "../queriesUtils";

describe("isSelectQuery", () => {
  // Valid SELECT queries
  it("should return true for simple SELECT queries", () => {
    expect(isSelectQuery("SELECT * FROM users")).toBe(true);
  });

  it("should return true for SELECT with WHERE clause", () => {
    expect(isSelectQuery("SELECT id, name FROM users WHERE age > 30")).toBe(
      true,
    );
  });

  it("should return true for SELECT with JOIN", () => {
    expect(
      isSelectQuery(
        "SELECT u.name, o.id FROM users u JOIN orders o ON u.id = o.user_id",
      ),
    ).toBe(true);
  });

  // Invalid queries with forbidden keywords
  it("should return false for INSERT query", () => {
    expect(
      isSelectQuery('INSERT INTO users (name, age) VALUES ("John", 25)'),
    ).toBe(false);
  });

  it("should return false for UPDATE query", () => {
    expect(isSelectQuery("UPDATE users SET age = 30 WHERE id = 1")).toBe(false);
  });

  it("should return false for DELETE query", () => {
    expect(isSelectQuery("DELETE FROM users WHERE id = 1")).toBe(false);
  });

  it("should return false for DROP query", () => {
    expect(isSelectQuery("DROP TABLE users")).toBe(false);
  });

  it("should return false for ALTER query", () => {
    expect(
      isSelectQuery("ALTER TABLE users ADD COLUMN email VARCHAR(255)"),
    ).toBe(false);
  });

  it("should return false for CREATE query", () => {
    expect(isSelectQuery("CREATE TABLE users (id INT, name TEXT)")).toBe(false);
  });

  it("should return false for REPLACE query", () => {
    expect(
      isSelectQuery('REPLACE INTO users (id, name) VALUES (1, "John")'),
    ).toBe(false);
  });

  it("should return false for TRUNCATE query", () => {
    expect(isSelectQuery("TRUNCATE TABLE users")).toBe(false);
  });

  // Invalid queries with semicolons
  it("should return false for queries with a semicolon", () => {
    expect(isSelectQuery("SELECT * FROM users; DROP TABLE users")).toBe(false);
    expect(isSelectQuery("SELECT * FROM users;")).toBe(false);
  });

  // Empty or invalid queries
  it("should return false for empty queries", () => {
    expect(isSelectQuery("")).toBe(false);
  });

  // Case insensitivity
  it("should return true for SELECT queries with uppercase keywords", () => {
    expect(isSelectQuery("SELECT * FROM users")).toBe(true);
    expect(isSelectQuery("SELECT id FROM USERS WHERE AGE > 30")).toBe(true);
  });
});
