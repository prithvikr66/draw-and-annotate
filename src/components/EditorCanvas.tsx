import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, FabricImage, Rect, Circle, FabricText, Line, Point } from "fabric";
import { Tool, TextOptions } from "./ImageEditor";
import { toast } from "sonner";

interface EditorCanvasProps {
  imageUrl: string;
  activeTool: Tool;
  textOptions: TextOptions;
  onToolChange: (tool: Tool) => void;
}

export const EditorCanvas = ({ imageUrl, activeTool, textOptions, onToolChange }: EditorCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [annotationHistory, setAnnotationHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });

    setFabricCanvas(canvas);

    // Load the uploaded image
    FabricImage.fromURL(imageUrl).then((img) => {
      // Scale image to fit canvas
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const imgAspectRatio = img.width! / img.height!;
      const canvasAspectRatio = canvasWidth / canvasHeight;

      let scaleX, scaleY;
      if (imgAspectRatio > canvasAspectRatio) {
        // Image is wider than canvas
        scaleX = scaleY = canvasWidth / img.width!;
      } else {
        // Image is taller than canvas
        scaleX = scaleY = canvasHeight / img.height!;
      }

      img.set({
        scaleX,
        scaleY,
        left: (canvasWidth - img.width! * scaleX) / 2,
        top: (canvasHeight - img.height! * scaleY) / 2,
        selectable: false,
        evented: false,
      });

      canvas.add(img);
      canvas.sendObjectToBack(img);
      canvas.renderAll();
    });

    return () => {
      canvas.dispose();
    };
  }, [imageUrl]);

  // Handle undo functionality
  useEffect(() => {
    const handleUndo = () => {
      if (!fabricCanvas || annotationHistory.length === 0) {
        toast.error("Nothing to undo");
        return;
      }

      const objects = fabricCanvas.getObjects();
      const lastAnnotation = objects[objects.length - 1];
      
      if (lastAnnotation && lastAnnotation.selectable !== false) {
        fabricCanvas.remove(lastAnnotation);
        setAnnotationHistory(prev => prev.slice(0, -1));
        toast.success("Annotation removed");
      }
    };

    window.addEventListener('undo-annotation', handleUndo);
    return () => window.removeEventListener('undo-annotation', handleUndo);
  }, [fabricCanvas, annotationHistory]);

  // Handle canvas clicks for annotations
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleCanvasClick = (event: any) => {
      if (activeTool === "select") return;

      const pointer = fabricCanvas.getPointer(event.e);
      
      switch (activeTool) {
        case "rectangle":
          const rect = new Rect({
            left: pointer.x - 50,
            top: pointer.y - 25,
            width: 100,
            height: 50,
            fill: "transparent",
            stroke: "#007bff",
            strokeWidth: 2,
          });
          fabricCanvas.add(rect);
          setAnnotationHistory(prev => [...prev, rect]);
          break;

        case "circle":
          const circle = new Circle({
            left: pointer.x - 40,
            top: pointer.y - 40,
            radius: 40,
            fill: "transparent",
            stroke: "#007bff",
            strokeWidth: 2,
          });
          fabricCanvas.add(circle);
          setAnnotationHistory(prev => [...prev, circle]);
          break;

        case "arrow":
          const arrowLine = new Line([pointer.x, pointer.y, pointer.x + 60, pointer.y - 30], {
            stroke: "#007bff",
            strokeWidth: 2,
          });
          
          // Create arrowhead
          const arrowHead = new Line([pointer.x + 60, pointer.y - 30, pointer.x + 50, pointer.y - 35], {
            stroke: "#007bff",
            strokeWidth: 2,
          });
          
          const arrowHead2 = new Line([pointer.x + 60, pointer.y - 30, pointer.x + 50, pointer.y - 25], {
            stroke: "#007bff",
            strokeWidth: 2,
          });

          fabricCanvas.add(arrowLine, arrowHead, arrowHead2);
          setAnnotationHistory(prev => [...prev, arrowLine, arrowHead, arrowHead2]);
          break;

        case "text":
          const text = new FabricText("Double click to edit", {
            left: pointer.x,
            top: pointer.y,
            fontSize: textOptions.fontSize,
            fontFamily: textOptions.fontFamily,
            fontWeight: textOptions.bold ? "bold" : "normal",
            textAlign: textOptions.alignment,
            fill: "#007bff",
          });
          
          fabricCanvas.add(text);
          setAnnotationHistory(prev => [...prev, text]);
          break;
      }

      // Switch back to select tool after adding annotation
      onToolChange("select");
    };

    fabricCanvas.on("mouse:down", handleCanvasClick);

    return () => {
      fabricCanvas.off("mouse:down", handleCanvasClick);
    };
  }, [fabricCanvas, activeTool, textOptions, onToolChange]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/30">
      <div className="border-2 border-canvas-border rounded-lg shadow-md overflow-hidden">
        <canvas ref={canvasRef} className="block" />
      </div>
    </div>
  );
};