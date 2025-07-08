import React, { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { sql, SQLite } from "@codemirror/lang-sql";

const CodeEditor: React.FC<{
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  executeQuery: () => void;
}> = ({ query, setQuery, executeQuery }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const view = new EditorView({
      doc: "",
      extensions: [basicSetup, sql({ dialect: SQLite })],
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, []);

  useEffect(() => {
    if (!viewRef.current) return;

    const editorState = viewRef.current.state;
    const currentValue = editorState.doc.toString();

    if (query !== currentValue) {
      const transaction = editorState.update({
        changes: {
          from: 0,
          to: currentValue.length,
          insert: query,
        },
      });
      viewRef.current.dispatch(transaction);
    }
  }, [query]);

  const setQueryFromEditor = () => {
    setQuery(viewRef.current?.state.doc.toString() ?? query);
  };

  return (
    <div className="w-full max-w-4xl rounded-box bg-base-200 p-6 shadow-lg">
      <h2 className="mb-4 text-lg font-bold text-base-content">
        SQLite Editor
      </h2>

      <div className="mb-2 text-sm text-base-content/70">
        <span className="font-semibold">Query Preview:</span> {query}
      </div>

      <div
        ref={editorRef}
        className="mb-4 h-40 w-full overflow-auto rounded-box border border-base-300 bg-base-100 p-3 font-mono text-sm focus:outline-none"
      />

      <div className="flex gap-2">
        <button onClick={executeQuery} className="btn btn-primary">
          Run Query
        </button>
        <button onClick={setQueryFromEditor} className="btn btn-info">
          Sync Editor to Query
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
