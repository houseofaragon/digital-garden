import { useEffect, useRef, useState } from "react";
import { getStroke } from "perfect-freehand";
import * as Y from "yjs";

const Draw = ({ document, persistence }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const ystrokes = document.get("strokes");
  //ystrokes.clear();
  if (!ystrokes) return;

  useEffect(() => {
    //console.log("ystrokes", ystrokes.toJSON());
    // ystrokes.toArray().forEach((ystroke) => {
    //   drawStroke(ystroke.toArray());
    // });
  }, [ystrokes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setContext(ctx);

    ystrokes.observe((event) => {
      event.changes.added.forEach((item) => {
        item.content.getContent().forEach((ystroke) => {
          drawStroke(ystroke.toArray());
        });
      });
    });

    return () => {
      ystrokes.unobserve();
    };
  }, [context]);

  const drawStroke = (points) => {
    if (!context) return;

    const stroke = getStroke(points, {
      size: 2,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
      simulatePressure: true,
    });

    // Convert stroke points to a path and draw it
    const path = getSvgPathFromStroke(stroke);
    const myPath = new Path2D(path);
    context.fill(myPath);
  };

  const onPointerDown = (e) => {
    setIsDrawing(true);
    // const rect = canvasRef.current.getBoundingClientRect();
    // const x = e.clientX - rect.left;
    // const y = e.clientY - rect.top;
    // const newStroke = new Y.Array();
    // newStroke.push([[x, y, e.pressure]]);
    // ydoc.getMap("root").get("strokeNodes").push([newStroke]);
  };

  const onPointerMove = (e) => {
    if (!isDrawing) return;

    // const rect = canvasRef.current.getBoundingClientRect();
    // const x = e.clientX - rect.left;
    // const y = e.clientY - rect.top;

    // const currentStroke = ydoc
    //   .getMap("root")
    //   .get("strokeNodes")
    //   .get(ystrokes.toArray().length - 1);

    // currentStroke.push([[x, y, e.pressure]]);
    // const points = currentStroke.toArray(); // Get all points in the current stroke
    // drawStroke(points); // Draw the stroke to the canvas
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newStroke = new Y.Array();
    newStroke.push([[x, y, e.pressure]]);
    ystrokes.push([newStroke]);
  };

  const onPointerUp = () => {
    setIsDrawing(false);
  };

  const clearDrawing = () => {
    console.log(ydoc.getMap("root").get("strokeNodes").toJSON());
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Optional: Clear and redraw if needed
  };

  function getSvgPathFromStroke(points, closed = true) {
    const len = points.length;

    if (len < 4) {
      return ``;
    }

    let a = points[0];
    let b = points[1];
    const c = points[2];

    let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
      2
    )},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
      b[1],
      c[1]
    ).toFixed(2)} T`;

    for (let i = 2, max = len - 1; i < max; i++) {
      a = points[i];
      b = points[i + 1];
      result += `${average(a[0], b[0]).toFixed(2)},${average(
        a[1],
        b[1]
      ).toFixed(2)} `;
    }

    if (closed) {
      result += "Z";
    }

    return result;
  }

  const average = (a, b) => (a + b) / 2;

  return (
    <div className="draw">
      <canvas
        className="draw-canvas"
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        width="300"
        height="300"
        style={{ border: "1px solid black", cursor: "crosshair" }}
      ></canvas>
      <button onClick={clearDrawing}>Clear</button>
    </div>
  );
};

export default Draw;
