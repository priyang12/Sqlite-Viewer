import React from "react";
import { OPERATORS } from "../../../Utils/queriesUtils";

function Conditions({
  conditions,
  editCondition,
  removeCondition,
}: {
  conditions: string[];
  editCondition: (index: number) => void;
  removeCondition: (index: number) => void;
}) {
  return (
    <ul className="space-y-2">
      {conditions.map((item, index) => (
        <li
          key={index}
          data-index={index}
          className="flex items-center justify-between rounded-md bg-base-100 p-3 shadow-sm"
        >
          <span className="text-base-content">{item}</span>
          <div className="space-x-2">
            <button
              onClick={() => editCondition(index)}
              className="rounded border border-blue-600 px-2 py-1 text-sm text-blue-600 hover:bg-blue-50"
            >
              Edit
            </button>
            <button
              onClick={() => removeCondition(index)}
              className="rounded border border-red-600 px-2 py-1 text-sm text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

// temp solution since it's create more complexity and loose code.
// change the condition array shape from string[] to Condition[] and pass the string[] to
// Insert Conditions.
const parseCondition = (conditionStr: string): Condition | null => {
  // Regex to match: column operator value
  const regex = /^(.+?)\s*(=|!=|>|<|>=|<=|LIKE)\s*(.+)$/i;
  const match = conditionStr.match(regex);

  if (!match) return null;

  const [, column, operator, value] = match;

  return {
    column: column.trim(),
    operator: operator.trim(),
    value: value.trim().replace(/^['"]|['"]$/g, ""), // remove quotes
  };
};

type Condition = {
  column: string;
  operator: string;
  value: string;
};
type ConditionField = keyof Condition; // "column" | "operator" | "value"

const emptyCondition = {
  column: "",
  operator: "",
  value: "",
};

const ConditionFilter: React.FC<{
  columns: string[];
  setWhereConditions: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ columns, setWhereConditions }) => {
  const [conditions, setConditions] = React.useState<string[]>();
  const [currentCondition, setCurrentCondition] =
    React.useState<Condition>(emptyCondition);

  const updateNewCondition = (e: any) => {
    const field = e.target.getAttribute("data-id"); // 'column', 'operator', or 'value'
    const value = e.target.value;
    if (!field) return;

    setCurrentCondition((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  };

  const editCondition = (conditionIndex: number) => {
    if (conditions) {
      const conditionToEdit = conditions[conditionIndex];
      const condition = parseCondition(conditionToEdit);
      if (condition) {
        setCurrentCondition(condition);
        removeCondition(conditionIndex);
      }
    }
  };

  const removeCondition = (conditionIndex: number) => {
    setConditions((prev) =>
      prev ? prev.filter((_, index) => index !== conditionIndex) : undefined,
    );
  };

  const insertCondition = () => {
    setConditions((state) => {
      if (state) {
        return [
          ...state,
          `(${currentCondition.column} ${currentCondition.operator} ${currentCondition.value})`,
        ];
      }
      return state;
    });
    setCurrentCondition(emptyCondition);
  };

  return (
    <div className="flex flex-col gap-5 bg-gray-800 p-5">
      <div className="flex items-center gap-2">
        <span className="font-semibold">WHERE</span>
        <input
          type="checkbox"
          className="checkbox-primary checkbox"
          checked={!!conditions}
          onChange={(e) => {
            // on click if table is not selected focus the table input using ref.
            if (e.target.checked) {
              setConditions([]);
            } else {
              setConditions(undefined);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setConditions((state) =>
                typeof state === "undefined" ? [] : undefined,
              );
            }
          }}
        />
      </div>
      {/* add ADD OR NOT if the one condition already exist. */}
      {typeof conditions !== "undefined" && columns.length > 0 ? (
        <>
          <div className="flex gap-2">
            <select
              data-id={"column" satisfies ConditionField}
              value={currentCondition.column}
              onChange={updateNewCondition}
            >
              <option value="">Column</option>
              {columns.map((col) => (
                <option
                  key={col}
                  value={col}
                  selected={currentCondition.column === col}
                >
                  {col}
                </option>
              ))}
            </select>
            <select
              data-id={"operator" satisfies ConditionField}
              value={currentCondition.operator}
              onChange={updateNewCondition}
            >
              <option value="">Condition</option>
              {OPERATORS.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
            {/* !["IS NULL", "IS NOT NULL"] */}
            <input
              data-id={"value" satisfies ConditionField}
              placeholder="Value"
              value={currentCondition.value}
              onChange={updateNewCondition}
            />
            <button onClick={insertCondition}> ADD </button>
          </div>
          <div>
            <button
              className="btn"
              onClick={() => setWhereConditions(conditions)}
            >
              Insert Conditions
            </button>
          </div>
        </>
      ) : null}
      {conditions ? (
        <Conditions
          conditions={conditions}
          editCondition={editCondition}
          removeCondition={removeCondition}
        />
      ) : (
        <div>NO conditions</div>
      )}
    </div>
  );
};
export default ConditionFilter;
