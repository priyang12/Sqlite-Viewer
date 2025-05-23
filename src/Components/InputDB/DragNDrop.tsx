import * as React from "react";

export type PropType = {
  children: React.ReactNode;
  onUpload: (files: FileList) => void;
  OpenFileModel: () => void;
};

const DragNDrop = ({ children, onUpload, OpenFileModel }: PropType) => {
  const [dragging, setDragging] = React.useState(false);
  const dragCounter = React.useRef(0);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  };

  const handleDragOut = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current > 0) return;
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
      e.dataTransfer.clearData();
      dragCounter.current = 0;
    }
  };

  return (
    <div
      className="h-full w-full"
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={OpenFileModel}
    >
      {dragging ? (
        <div className="flex h-full items-center justify-center bg-base-100">
          <div className="border-4 border-dashed border-red-300 p-10">
            <p className="text-3xl">Drop files here</p>
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default DragNDrop;
