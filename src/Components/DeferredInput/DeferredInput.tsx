import { useDeferredValue, useEffect, useState } from "react";

function DeFerredInput({
  value: initialValue,
  onChange,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [filterSearch, setFilterSearch] = useState(initialValue);
  const deferredFilterSearch = useDeferredValue(filterSearch);

  useEffect(() => {
    onChange(deferredFilterSearch);
  }, [deferredFilterSearch, onChange]);

  return (
    <input
      {...props}
      value={filterSearch}
      onChange={(e) => setFilterSearch(e.target.value)}
    />
  );
}

export default DeFerredInput;
