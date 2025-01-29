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

  useEffect(() => {
    const persistence = new IndexeddbPersistence("digital-garden-room", ydoc);
    const docNodes = ydoc.getMap("root").get("docNodes") as Y.Array<Y.Map<any>>;

    persistence.on("synced", () => {
      updateDocumentList();
    });

    const updateDocumentList = () => {
      const docNodes = ydoc.getMap("root").get("docNodes").toArray();
      setDocumentList([...docNodes]);
    };

    ydoc.getMap("root").observeDeep(updateDocumentList);

    return () => {
      ydoc.getMap("root").observeDeep(updateDocumentList);
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

    ydoc.getMap("root").get("docNodes").push([newDoc]);
  };

  const cloneYMap = (original: Y.Map<any>): Y.Map<any> => {
    const newMap = new Y.Map();

    original.forEach((value, key) => {
      if (value instanceof Y.Text) {
        const newText = new Y.Text();
        newText.insert(0, value.toString());
        newMap.set(key, newText);
      } else if (value instanceof Y.Map) {
        newMap.set(key, cloneYMap(value));
      } else if (value instanceof Y.Array) {
        const newArray = new Y.Array();
        newArray.push(value.toArray());
        newMap.set(key, newArray);
      } else {
        newMap.set(key, value);
      }
    });

    return newMap;
  };

  const updateElement = (updatedElement: Y.Map<any>) => {
    const docNodes = ydoc.getMap("root").get("docNodes") as Y.Array<Y.Map<any>>;

    // Find index of element with matching ID
    const index = docNodes
      .toArray()
      .findIndex((doc) => doc.get("id") === updatedElement.get("id"));

    if (index !== -1) {
      ydoc.transact(() => {
        const updatedCopy = cloneYMap(updatedElement); // Make a direct clone

        docNodes.delete(index, 1); // Remove old element
        docNodes.insert(index, [updatedCopy]); // Insert updated element
      });
    }
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
