import { useState } from "react";
import { ImageUpload } from "./ImageUpload";
import { EditorCanvas } from "./EditorCanvas";
import { Toolbar } from "./Toolbar";
import { TextCustomizer } from "./TextCustomizer";
import { Card } from "@/components/ui/card";

export type Tool = "select" | "rectangle" | "circle" | "arrow" | "text";

export interface TextOptions {
  fontSize: number;
  fontFamily: string;
  bold: boolean;
  alignment: "left" | "center" | "right" | "justify";
}

export const ImageEditor = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [textOptions, setTextOptions] = useState<TextOptions>({
    fontSize: 16,
    fontFamily: "Arial",
    bold: false,
    alignment: "left",
  });

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setActiveTool("select");
  };

  if (!uploadedImage) {
    return (
      <div className="min-h-screen bg-editor-bg p-6">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Image Annotation Studio
            </h1>
            <p className="text-muted-foreground">
              Upload an image and start annotating with powerful tools
            </p>
          </header>
          <ImageUpload onImageUpload={handleImageUpload} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-editor-bg">
      <div className="flex h-screen">
        {/* Left Sidebar - Tools */}
        <Card className="w-64 m-4 p-4 bg-background shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Tools</h2>
          <Toolbar activeTool={activeTool} onToolChange={setActiveTool} onReset={handleReset} />
          
          {activeTool === "text" && (
            <div className="mt-6">
              <h3 className="text-md font-medium mb-3">Text Options</h3>
              <TextCustomizer options={textOptions} onChange={setTextOptions} />
            </div>
          )}
        </Card>

        {/* Main Canvas Area */}
        <div className="flex-1 p-4">
          <Card className="h-full bg-background shadow-lg overflow-hidden">
            <EditorCanvas
              imageUrl={uploadedImage}
              activeTool={activeTool}
              textOptions={textOptions}
              onToolChange={setActiveTool}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};