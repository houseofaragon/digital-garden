import type React from "react";
import DraggableElement from "./DraggableElement";
import type { ElementType } from "../types";
import Editor from "./TextEditor";
import { useRef } from "react";

interface CanvasProps {
  elements: ElementType[];
  addElement: (type: string, x: number, y: number) => void;
  updateElement: (element: ElementType) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  addElement,
  updateElement,
  provider,
  documentList,
  deleteElement,
}) => {
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const quillRef = useRef(null);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("text");
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;
    addElement(type, x, y);
  };

  const renderEditor = (document) => (
    <Editor document={document} ref={quillRef} provider={provider} />
  );

  const renderElement = (document) => {
    const type = document.get("metadata").get("type");
    console.log("type", type);
    switch (type) {
      case "text":
        return renderEditor(document);
        break;
      default:
        return null;
    }
  };

  return (
    <div className="canvas" onDragOver={onDragOver} onDrop={onDrop}>
      {documentList.map((document) => (
        <div key={document.get("metadata").get("key")}>
          <DraggableElement
            element={document}
            updateElement={updateElement}
            provider={provider}
            deleteElement={deleteElement}
          >
            {renderElement(document)}
          </DraggableElement>
        </div>
      ))}
    </div>
  );
};

export default Canvas;
