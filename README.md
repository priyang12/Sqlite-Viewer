# Sqlite Editor

A Web App (offline) for viewing the Sqlite databases and edit it. Run diffrent queries and edit the db and create a new DB which can be saved.

## Tech Stack

**Client:** React, TailwindCSS, sql.js, idb

## Roadmap

- [x] make a readme file.

### User database

- [x] make sure of .db extension can send the file.
- [x] remove the db from indexDB.
- [x] remove the db from indexedDB.
- [x] make context for interactive CRUD operation with indexedDB.
- [x] setup vitest.
- [x] test contexts.
- [x] test hooks.
- [x] Load Database from IndexDB.

### UI dev

- [x] Redirect Home to the Tables page.
- [x] display all the tables.
- [x] sidebar for tables and main for Content.
- [x] GetData Hook and test cases.
- [x] make a Search Component.
- [x] nested Database layout and nested routes for tables and overview.
- [x] getTableData Hook and test cases.
- [x] display table in UserDatabase.
- [x] Pagination in rows.
- [x] filter and sort in table.
- [x] style the table components.
- [x] Resize the column.
- [x] Add test for table Components.
- [x] skeleton loading.
- [x] hook to exec multiple queries parallel.
- [x] data types of column in header.
- [x] primary and foreign keys.
- [x] Multiple Filter.
- [x] Pin Column.
- [x] User Databases Page.
- [x] CSV export of table data.
- [x] Add and remove filters.

## bugs

- [] fix rerender due to useEffect. look if effect can comply removed.

## Creator

Priyang Patel

## License

MIT License

Copyright (c) [2024] [Priyang Patel]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
