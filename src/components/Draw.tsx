import { useEffect, useRef, useState } from "react";
import { getStroke } from "perfect-freehand";
import * as Y from "yjs";

const Draw = ({ ydoc, persistence }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const ystrokes = ydoc.getMap("root").get("strokeNodes");

  useEffect(() => {
    ystrokes.toArray().forEach((ystroke) => {
      drawStroke(ystroke.toArray());
    });
  }, [ydoc]);

  // Set up canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setContext(ctx);

    // Observe strokes and redraw new ones
    ydoc
      .getMap("root")
      .get("strokeNodes")
      .observe((event) => {
        event.changes.added.forEach((item) => {
          item.content.getContent().forEach((ystroke) => {
            drawStroke(ystroke.toArray());
          });
        });
      });

    return () => {
      ydoc.getMap("root").get("strokeNodes").unobserve();
    };
  }, [context]);

  const drawStroke = (points) => {
    if (!context) return;

    const stroke = getStroke(points, {
      size: 8,
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

  const clearDrawing = () => {
    console.log(ydoc.getMap("root").get("strokeNodes").toJSON());
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Optional: Clear and redraw if needed
  };

  const onPointerDown = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newStroke = new Y.Array();
    newStroke.push([[x, y, e.pressure]]);
    ydoc.getMap("root").get("strokeNodes").push([newStroke]);
  };

  const onPointerMove = (e) => {
    if (!isDrawing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Get the last stroke
    const currentStroke = ydoc
      .getMap("root")
      .get("strokeNodes")
      .get(ystrokes.toArray().length - 1);

    // Add the new point to the stroke
    currentStroke.push([[x, y, e.pressure]]);

    // Draw the stroke in real-time
    const points = currentStroke.toArray(); // Get all points in the current stroke
    // ydoc.getMap("root").get("strokeNodes").push([newStroke]);

    drawStroke(points); // Draw the stroke to the canvas
    ydoc.getMap("root").get("strokeNodes").push([currentStroke]);
  };

  const onPointerUp = () => {
    setIsDrawing(false);
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
    <>
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        width="100%"
        height="100%"
        style={{ border: "1px solid black", cursor: "crosshair" }}
      ></canvas>
      <button onClick={clearDrawing}>Clear</button>
    </>
  );
};

export default Draw;
