# Sqlite Viewer

A lightweight offline web application for browsing and inspecting SQLite databases right in your browser. Built using modern React, sql.js, and fully installable as a Progressive Web App (PWA).

## Features

- Load and explore .db files directly in the browser.

- Visualize relationships between tables.

- Build and run custom SQL queries using a visual interface or raw SQL.

- Export data as CSV.

- Offline support via IndexedDB.

- Installable as a PWA. (Add to Home Screen)

## Toolset for Working with Databases

The application provides three powerful tools to interact with SQLite databases:

### 1. Tables View

- Explore and interact with your database tables

- Filter, sort, pin, reorder, and resize columns
- Pagination support for large datasets
- Column headers display:
  - Primary key icons
  - Foreign key indicators
  - Data type icons (if mapped)

### 2. Charts View

- Visualize table structure and relationships.

- Built with @xyflow/react
- Tables are rendered as draggable nodes on a canvas
- Foreign key relationships are automatically detected and visualized
- Columns display associated data types

### 3. Query Builder

- Build and run custom SQL queries using an interactive UI

- Visual query builder with intuitive components
- Query history panel tracks previously created queries
- Optional raw SQL editor using CodeMirror
- Validate and execute queries
- View query results in the Tables view

### Tech Stack

- **Frontend**: React 19

- **Styling**: TailwindCSS
- **SQLite** Engine: sql.js
- **IndexedDB**: idb
- **Editor**: CodeMirror 6
- **Charts**: @xyflow/react
- **Table** UI: @tanstack/react-table
- **Routing**: react-router-dom
- **CSV** Export: react-csv

## Getting Started

Prerequisites
Node.js ≥ 18

npm or yarn

### Installation

```bash
git clone https://github.com/your-username/sqlite-viewer.git
cd sqlite-viewer
npm install
```

### Run the app locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

## PWA Support

- This app can be installed on desktop or mobile as a Progressive Web App:

- Works offline using service workers
- "Add to Home Screen" prompt available on supported browsers
- Optimized for mobile and touch interfaces

## Roadmap

### Project Setup & Core Functionality

- [x] Create initial project structure and setup
- [x] Ensure `.db` files can be uploaded and handled
- [x] Load databases from IndexedDB
- [x] Implement context for interactive CRUD operations with IndexedDB
- [x] Add support to remove databases from IndexedDB
- [x] Setup testing environment with Vitest
- [x] Write and run tests for context and custom hooks

### UI & Layout

- [x] Design nested database layout and routing
- [x] Add sidebar navigation for tables and main content area
- [x] Redirect home route to Tables page
- [x] Create user databases page with `.db` listing
- [x] Skeleton loaders for async content
- [x] Wrap all major components/routes in error boundaries
- [x] Add a dedicated support/help page

### Tables View

- [x] Display all tables from the selected database
- [x] Add pagination for large datasets
- [x] Enable column resizing, sorting, and pinning
- [x] Add multi-filtering and custom search
- [x] Display column data types in headers
- [x] Show primary and foreign key icons in headers
- [x] Style and finalize table components
- [x] Export table data as CSV
- [x] Add tests for table components
- [x] Add/remove filters dynamically

### Charts View (Database Diagram)

- [x] Visualize tables as nodes using React Flow
- [x] Display foreign key relationships as edges
- [x] Show column data types within each table node
- [x] Allow canvas interaction (drag, zoom, pan)

### Query Builder

- [x] Create a visual query builder with interactive components
- [x] Maintain query history in a side panel
- [x] Integrate CodeMirror editor for raw SQL input
- [x] Execute and validate queries
- [x] Redirect to Tables view to display query results

## Planned Features

The following enhancements are planned and currently under development:

- Support for mutations (INSERT, UPDATE, DELETE) directly within the Query Builder / Playground.

- better builder table with more features.

- Improved UX for writing and debugging raw SQL.

- More advanced visual query composition with join suggestions.

## Creator

Priyang Patel

## License

MIT License

Copyright (c) [2025] [Priyang Patel]

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
