import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MousePointer, 
  Square, 
  Circle, 
  ArrowUpRight, 
  Type, 
  Undo, 
  RotateCcw 
} from "lucide-react";
import { Tool } from "./ImageEditor";

interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  onReset: () => void;
}

export const Toolbar = ({ activeTool, onToolChange, onReset }: ToolbarProps) => {
  const tools = [
    { id: "select" as Tool, icon: MousePointer, label: "Select" },
    { id: "rectangle" as Tool, icon: Square, label: "Rectangle" },
    { id: "circle" as Tool, icon: Circle, label: "Circle" },
    { id: "arrow" as Tool, icon: ArrowUpRight, label: "Arrow" },
    { id: "text" as Tool, icon: Type, label: "Text" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          
          return (
            <Button
              key={tool.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onToolChange(tool.id)}
              className={`h-12 ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-tool-hover border-border"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <Icon className="w-4 h-4" />
                <span className="text-xs">{tool.label}</span>
              </div>
            </Button>
          );
        })}
      </div>

      <Separator className="my-4" />

      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start hover:bg-tool-hover"
          onClick={() => {
            // This will be handled by the canvas component
            window.dispatchEvent(new CustomEvent('undo-annotation'));
          }}
        >
          <Undo className="w-4 h-4 mr-2" />
          Undo Last
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="w-full justify-start hover:bg-destructive hover:text-destructive-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All
        </Button>
      </div>
    </div>
  );
};