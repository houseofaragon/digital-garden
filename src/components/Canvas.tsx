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
  const onDragOver = (e: React.DragEvent) => {
    // allow dropping
    e.preventDefault();
  };

  const editorRef = useRef(null);
  const linkRef = useRef(null);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("text");
    console.log("type", type);
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    addElement(type, x, y);
  };

  const renderEditor = (document) => (
    <Editor document={document} ref={editorRef} provider={provider} />
  );

  const renderLink = (document) => {
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
    return <Draw document={document} />;
  };

  const renderMedia = (document) => {
    console.log("reder");
    console.log(
      "rendering media",
      `https://www.youtube.com/embed/${new URL(
        document.get("type").toString()
      ).searchParams.get("v")}`
    );
    const url = document.get("type").toString();
    const src = url.includes("embed")
      ? url
      : `https://www.youtube.com/embed/${new URL(
          document.get("type").toString()
        ).searchParams.get("v")}`;
    return <iframe width="300" height="215" src={src}></iframe>;
  };

  const renderElement = (document) => {
    if (!(document instanceof Y.Map) || !document.has("type")) return;

    const type = document.get("type").toString();

    if (type.includes("http")) return renderMedia(document);
    switch (type) {
      case "text":
        return renderEditor(document);
      case "link":
        return renderLink(document);
      case "draw":
        return renderDraw(document);
      case type.includes("http"):
        return renderMedia(document);
      default:
        return null;
    }
  };

  return (
    <div className="canvas" onDragOver={onDragOver} onDrop={onDrop}>
         <pre className="ascii">
          ...Start growing...
      {`
                   _(_)_                         wWWWw   _
       @@@@       (_)@(_)  vVVVv     _     @@@@  (___) _(_)_
     @@()@@ wWWWw   (_)\ .  (___)   _(_)_  @@()@@   Y  (_)@(_)
      @@@@  (___)     \`|/    Y    (_)@(_)  @@@@   \\|/   (_)\\
       /      Y       \\|    \\|/    /(_)    \\|      |/      |
    \\ |     \\ |/       | / \\ | /  \\|/       |/    \\|      \\|/
    \\\\|//   \\\\|///  \\\\\\|//\\\\\\|///\ \\|///  \\\\\\|//  \\\\|//  \\\\\\|// 
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      `}
    </pre>
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
