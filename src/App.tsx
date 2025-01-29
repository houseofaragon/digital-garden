import type React from "react";
import { useEffect, useRef, useState } from "react";
import Toolbar from "./components/Toolbar";
import Canvas from "./components/Canvas";
import "./index.css";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { IndexeddbPersistence } from "y-indexeddb";
import { v4 as uuidv4 } from "uuid";
const ydoc = new Y.Doc();
const root = ydoc.getMap("root");
const docNodes = new Y.Array();
const strokeNodes = new Y.Array();

if (!root.has("docNodes")) {
  root.set("docNodes", docNodes);
}

if (!root.has("strokeNodes")) {
  root.set("strokeNodes", strokeNodes);
}
const provider = new WebrtcProvider("digital-garden-room", ydoc);

const App: React.FC = () => {
  const [documentList, setDocumentList] = useState<Y.Map<any>[]>([]);
  //const [provider, setProvider] = useState(null);

  // Initialize shared types

  useEffect(() => {
    const persistence = new IndexeddbPersistence("digital-garden-room", ydoc);
    // setProvider(provider);
    const docNodes = ydoc.getMap("root").get("docNodes") as Y.Array<Y.Map<any>>;

    // Initial sync
    persistence.on("synced", () => {
      updateDocumentList();
    });

    const updateDocumentList = () => {
      //console.log("updating document list", docNodes.toArray());
      const docNodes = ydoc.getMap("root").get("docNodes").toArray();
      setDocumentList([...docNodes]);
    };

    // Observe changes to `docNodes`
    //ydoc.getMap("root").get("docNodes").observeDeep(updateDocumentList);
    ydoc.getMap("root").observeDeep(updateDocumentList);

    return () => {
      ydoc.getMap("root").unobserveDeep(updateDocumentList);
      // provider.disconnect();
      // ydoc.destroy();
    };
  }, [ydoc]);

  const addElement = (type: string, x: number, y: number) => {
    const id = uuidv4();
    const yText = new Y.Text();
    const yLink = new Y.Text();
    const yType = new Y.Text();
    yType.insert(0, type);

    const newDoc = new Y.Map();
    newDoc.set("text", yText);
    newDoc.set("link", yLink);
    newDoc.set("id", id);
    newDoc.set("x", x);
    newDoc.set("y", y);
    newDoc.set("type", yType);

    console.log("adding element", newDoc.toJSON());
    ydoc.getMap("root").get("docNodes").push([newDoc]);
  };

  const updateElement = (updatedElement: Y.Map<any>) => {
    if (!(updatedElement instanceof Y.Map) || !updatedElement.has("type"))
      return;

    const docNodes = ydoc.getMap("root").get("docNodes");
    docNodes.forEach((doc, idx) => {
      if (updatedElement.get("id") === doc.get("id")) {
        ydoc.transact(() => {
          ydoc.getMap("root").get("docNodes").delete(idx, 1);
          ydoc.getMap("root").get("docNodes").insert(idx, [updatedElement]);
        });
      }
    });
  };

  const deleteElement = (element: Y.Map<any>) => {
    console.log("deleting!!");
    ydoc
      .getMap("root")
      .get("docNodes")
      .forEach((doc, idx) => {
        if (element.get("id") === doc.get("id")) {
          ydoc.getMap("root").get("docNodes").delete(idx, 1);
        }
      });
    console.log("docNodes", ydoc.getMap("root").get("docNodes").toJSON());
  };

  console.log("ydoc", ydoc.toJSON());
  console.log("document", documentList);
  //if (!provider) return;
  return (
    <div className="app">
      <Toolbar />
      <Canvas
        documentList={documentList}
        ydoc={ydoc}
        provider={provider}
        addElement={addElement}
        updateElement={updateElement}
        deleteElement={deleteElement}
      />
    </div>
  );
};

export default App;
