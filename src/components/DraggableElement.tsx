import type React from "react";
import { useRef, useState } from "react";
import Draggable from "react-draggable";
import type { ElementType } from "../types";

interface DraggableTextProps {
  element: ElementType;
  updateElement: (element: ElementType) => void;
}

const DraggableText: React.FC<DraggableTextProps> = ({
  element,
  updateElement,
  deleteElement,
  children,
}) => {
  const nodeRef = useRef(null);
  // if (!element.has("x") || !element.has("y")) return;

  const [position, setPosition] = useState({
    x: element.get("x"),
    y: element.get("y"),
  });

  const handleUpdateElement = (e, data) => {
    e.preventDefault();
    if (0 === data.x && 0 === data.y) return;
    element.set("x", Math.abs(position.x + data.x));
    element.set("y", Math.abs(position.y + data.y));
    console.log('moving', element.toJSON())
    updateElement(element);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    deleteElement(element);
  };

  console.log("elementss", element);
  return (
    <Draggable nodeRef={nodeRef} onStop={handleUpdateElement} cancel="strong">
      <div
        ref={nodeRef}
        className="draggable-element"
        style={{
          position: "absolute",
          top: position.y,
          left: position.x,
        }}
      >
        <strong>{children}</strong>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </Draggable>
  );
};

export default DraggableText;
