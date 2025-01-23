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
  const metadata = element.get("metadata");
  const left = metadata.get("x");
  const top = metadata.get("y");
  const style = {
    position: "absolute",
    top,
    left,
  };

  const [position, setPosition] = useState({
    x: element.get("metadata").get("x"),
    y: element.get("metadata").get("y"),
  });

  const handleUpdateElement = (e, data) => {
    const id = element.get("metadata").get("id");
    const deltaPos = {
      x: Math.abs(position.x + data.x),
      y: Math.abs(position.y + data.y),
    };
    updateElement(id, deltaPos);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    const id = element.get("metadata").get("id");
    deleteElement(id);
  };

  return (
    <Draggable nodeRef={nodeRef} onStop={handleUpdateElement}>
      <div ref={nodeRef} className="draggable-element" style={style}>
        {children}
        <button onClick={handleDelete}>Delete</button>
      </div>
    </Draggable>
  );
};

export default DraggableText;
