import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { TextOptions } from "./ImageEditor";

interface TextCustomizerProps {
  options: TextOptions;
  onChange: (options: TextOptions) => void;
}

export const TextCustomizer = ({ options, onChange }: TextCustomizerProps) => {
  const fontFamilies = [
    "Open Sans",
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Verdana",
    "Courier New",
    "Impact",
    "Comic Sans MS"
  ];

  const alignments = [
    { value: "left" as const, icon: AlignLeft },
    { value: "center" as const, icon: AlignCenter },
    { value: "right" as const, icon: AlignRight },
    { value: "justify" as const, icon: AlignJustify },
  ];

  return (
    <div className="space-y-3 p-4 bg-background border rounded-lg">
      {/* Font Family */}
      <Select
        value={options.fontFamily}
        onValueChange={(value) => onChange({ ...options, fontFamily: value })}
      >
        <SelectTrigger className="h-10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {fontFamilies.map((font) => (
            <SelectItem key={font} value={font}>
              {font}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Font Size and Style Controls */}
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="8"
          max="72"
          value={options.fontSize}
          onChange={(e) =>
            onChange({ ...options, fontSize: parseInt(e.target.value) || 16 })
          }
          className="w-16 h-10 text-center"
        />
        <Button
          variant={options.bold ? "default" : "outline"}
          size="sm"
          onClick={() => onChange({ ...options, bold: !options.bold })}
          className="w-10 h-10 p-0"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-10 h-10 p-0"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-10 h-10 p-0"
        >
          <Underline className="w-4 h-4" />
        </Button>
      </div>

      {/* Alignment */}
      <div className="flex gap-1">
        {alignments.map((alignment) => {
          const Icon = alignment.icon;
          const isActive = options.alignment === alignment.value;
          
          return (
            <Button
              key={alignment.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() =>
                onChange({ ...options, alignment: alignment.value })
              }
              className="flex-1 h-10"
            >
              <Icon className="w-4 h-4" />
            </Button>
          );
        })}
      </div>
    </div>
  );
};