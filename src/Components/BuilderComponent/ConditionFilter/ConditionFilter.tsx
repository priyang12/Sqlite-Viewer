import React from "react";
import { OPERATORS } from "../../../Utils/queriesUtils";

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
  setWhereConditions: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >;
}> = ({ columns, setWhereConditions }) => {
  const [conditions, setConditions] = React.useState<string[]>();
  const [addCondition, setAddCondition] =
    React.useState<Condition>(emptyCondition);

  const updateNewCondition = (e: any) => {
    const field = e.target.getAttribute("data-id"); // 'column', 'operator', or 'value'
    const value = e.target.value;
    if (!field) return;

    setAddCondition((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  };

  const insertCondition = () => {
    setConditions((state) => {
      if (state) {
        return [
          ...state,
          `(${addCondition.column} ${addCondition.operator} ${addCondition.value})`,
        ];
      }
      return state;
    });
    setAddCondition(emptyCondition);
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
              value={addCondition.column}
              onChange={updateNewCondition}
            >
              <option value="">Column</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <select
              data-id={"operator" satisfies ConditionField}
              value={addCondition.operator}
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
              value={addCondition.value}
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
    </div>
  );
};
export default ConditionFilter;
