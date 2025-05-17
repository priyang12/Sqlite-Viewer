export const queries = {
  table: {
    allTables: "SELECT name FROM sqlite_master WHERE type='table'",
    properties: (name: string) => `PRAGMA table_info('${name}');`,
    foreignKey: (tableName: string) => `PRAGMA foreign_key_list(${tableName});`,
  },
};
