import type React from "react";
import DraggableElement from "./DraggableElement";
import type { ElementType } from "../types";
import Editor from "./TextEditor";
import Link from "./Link";
import Draw from "./Draw";
import { useRef } from "react";
import * as Y from "yjs";

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
  ydoc,
}) => {
  // if (!provider) {
  //   return
  // }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const editorRef = useRef(null);
  const linkRef = useRef(null);

  const onDrop = (e: React.DragEvent) => {
    console.log("dropping");
    e.preventDefault();
    const type = e.dataTransfer.getData("text");
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;
    addElement(type, x, y);
  };

  const renderEditor = (document) => (
    <Editor document={document} ref={editorRef} provider={provider} />
  );

  const renderLink = (document) => {
    console.log("rendering link...");
    return (
      <Link
        document={document}
        ref={linkRef}
        provider={provider}
        updateElement={updateElement}
      />
    );
  };

  const renderDraw = (document) => {
    return <Draw ydoc={ydoc} />;
  };

  const renderElement = (document) => {
    if (!(document instanceof Y.Map) || !document.has("type")) return;

    const type = document.get("type").toString();

    switch (type) {
      case "text":
        return renderEditor(document);
      case "link":
        return renderLink(document);
      case "draw":
        return renderDraw(document);
      default:
        return null;
    }
  };

  return (
    <div className="canvas" onDragOver={onDragOver} onDrop={onDrop}>
      {documentList.map((document) => (
        <div className="draggable-card" key={document.get("id")}>
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
