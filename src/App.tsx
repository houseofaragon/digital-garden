import type React from "react";
import { useEffect, useRef, useState } from "react";
import Toolbar from "./components/Toolbar";
import Canvas from "./components/Canvas";
import "./index.css";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { IndexeddbPersistence } from "y-indexeddb";
import { v4 as uuidv4 } from "uuid";

// ydoc holds the shared types
// https://stackblitz.com/edit/y-quill-doc-list?file=index.ts
// https://github.com/yjs/y-webrtc

const App: React.FC = () => {
  const [documentList, setDocumentList] = useState([]);
  const ydoc = useRef(new Y.Doc()).current;

  useEffect(() => {
    const persistence = new IndexeddbPersistence("digital-garden-room", ydoc);
    const provider = new WebrtcProvider("digital-garden-room", ydoc);

    persistence.on("synced", () => {
      setDocumentList(ydoc.getArray("doc-list").toArray());
    });

    const documentArray = ydoc.getArray("doc-list");
    const observeDocs = () => {
      setDocumentList(documentArray.toArray());
    };
    documentArray.observe(observeDocs);

    return () => {
      documentArray.unobserve(observeDocs);
      provider.destroy();
      ydoc.destroy();
    };
  }, [ydoc]);

  const addElement = (type: string, x: number, y: number) => {
    const id = uuidv4();
    const yText = new Y.Text();

    const metadata = new Y.Map();
    metadata.set("x", x);
    metadata.set("y", y);
    metadata.set("type", type);
    metadata.set("id", id);

    const newDoc = new Y.Map();
    newDoc.set("text", yText);
    newDoc.set("metadata", metadata);

    ydoc.getArray("doc-list").push([newDoc]);
  };

  const updateElement = (id, data) => {
    const docArray = ydoc.getArray("doc-list");

    for (let i = 0; i < docArray.length; i++) {
      const doc = docArray.get(i);
      const metadata = doc.get("metadata");

      if (id === metadata.get("id")) {
        metadata.set("x", data.x);
        metadata.set("y", data.y);
        break;
      }
    }
  };

  const deleteElement = (id) => {
    const docArray = ydoc.getArray("doc-list");
    docArray.toArray().forEach((doc, idx) => {
      if (id === doc.get("metadata").get("id")) {
        docArray.delete(idx, 1);
        return;
      }
    });
  };

  return (
    <div className="app">
      <Toolbar />
      <Canvas
        documentList={documentList}
        addElement={addElement}
        updateElement={updateElement}
        provider={{}}
        deleteElement={deleteElement}
      />
    </div>
  );
};

export default App;
