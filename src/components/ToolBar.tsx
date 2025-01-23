import type React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFont } from "@fortawesome/free-solid-svg-icons";

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
        <FontAwesomeIcon icon={faFont} />
      </div>
    </div>
  );
};

export default Toolbar;
