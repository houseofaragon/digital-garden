import type React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFont, faLink, faPencil } from "@fortawesome/free-solid-svg-icons";

const Toolbar: React.FC = () => {
  const onDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("text/plain", type);
  };

  return (
    <div className="toolbar">
      <div
        className="tool"
        draggable
        onDragStart={(e) => onDragStart(e, "text")}
      >
        <FontAwesomeIcon icon={faFont} size="xs" />
      </div>
      <div
        className="tool"
        draggable
        onDragStart={(e) => onDragStart(e, "link")}
      >
        <FontAwesomeIcon icon={faLink} size="xs" />
      </div>
      <div
        className="tool"
        draggable
        onDragStart={(e) => onDragStart(e, "draw")}
      >
        <FontAwesomeIcon icon={faPencil} size="xs"  swapOpacity />
      </div>
    </div>
  );
};

export default Toolbar;
