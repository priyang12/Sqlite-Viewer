import React, { useState, ChangeEvent, useRef } from "react";
import IconComponent from "../IconComponent";
import DragNDrop from "./DragNDrop";

interface Props {
  onFileSelect: (file: File | null) => void;
}

const InputDB: React.FC<Props> = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  // pass down to the for upload Fn for overlay component.
  const onUploadFN = (files: FileList) => {
    const dbFiles = Array.from(files).filter((file) =>
      file.name.endsWith(".db"),
    );
    if (dbFiles.length > 0) {
      dbFiles.forEach((file) => onFileSelect(file));
    } else {
      // add notification here.
      alert("No files with a .db extension were selected.");
    }
  };

  // open the file when click outside.
  const OpenFileModel = () => {
    fileRef?.current?.click();
  };

  return (
    <>
      <DragNDrop onUpload={onUploadFN} OpenFileModel={OpenFileModel}>
        <div className="flex h-full w-full cursor-pointer flex-col items-center justify-evenly bg-base-100 p-5">
          <span className="rounded-lg bg-base-200 p-5 text-3xl">
            Drag and drop DB files
          </span>
          <span className="text-xl">Or Select</span>
          <div className="flex">
            <input
              type="file"
              className="file-input file-input-bordered file-input-md w-full max-w-xs"
              accept=".db"
              ref={fileRef}
              onChange={handleFileChange}
            />
            {selectedFile && <p>Selected File: {selectedFile.name}</p>}
            <span className="text-5xl">
              <IconComponent IconType="fileInput" />
            </span>
          </div>
        </div>
      </DragNDrop>
    </>
  );
};

export default InputDB;
