import type React from "react";
import { useRef, useState } from "react";
import Draggable from "react-draggable";
import type { ElementType } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpDownLeftRight, faTrashCan } from "@fortawesome/free-solid-svg-icons";

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
    console.log("moving", element.toJSON());
    updateElement(element);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    deleteElement(element);
  };

  console.log("elementss", element);
  return (
    <Draggable
      nodeRef={nodeRef}
      onStop={handleUpdateElement}
      handle="strong"
      // cancel="span"
    >
      <div
        ref={nodeRef}
        className="draggable-element"
        style={{
          position: "absolute",
          top: position.y,
          left: position.x,
        }}
      >
        <div className="draggable-menu">
          <div>
            <strong className="cursor">
              <FontAwesomeIcon icon={faUpDownLeftRight} />
            </strong>
          </div>
          <button onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
        <div style={{ width: "100%", height: "100%" }}>{children}</div>
      </div>
    </Draggable>
  );
};

export default DraggableText;
