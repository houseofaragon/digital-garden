import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import { QuillBinding } from "y-quill";

Quill.register("modules/cursors", QuillCursors);

/*
  controlled vs uncontrolled component in React

  - controlled - uses useState where React manages state

  - uncontrolled component uses useRef and state managed directly via DOM
*/
const Editor = forwardRef(({ provider, document }, ref) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const quill = new Quill(editorContainer, {
      theme: "snow",
    });

    const yText = document.get("text");
    const _binding = new QuillBinding(yText, quill, provider.awareness);

    ref.current = quill;

    return () => {
      ref.current = null;
      container.innerHTML = "";
    };
  }, [ref]);

  return <div ref={containerRef}></div>;
});

export default Editor;
