import React, { useState, ChangeEvent } from "react";
import IconComponent from "../IconComponent";

interface Props {
  onFileSelect: (file: File | null) => void;
}

const InputDB: React.FC<Props> = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    onFileSelect(file);
  };

  return (
    <div className="flex">
      <div className="flex">
        <input
          type="file"
          className="file-input file-input-bordered file-input-md w-full max-w-xs"
          accept=".db"
          onChange={handleFileChange}
        />
        {selectedFile && <p>Selected File: {selectedFile.name}</p>}
      </div>
      <span className="text-5xl">
        <IconComponent IconType="fileInput" />
      </span>
    </div>
  );
};

export default InputDB;
