import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bold, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { TextOptions } from "./ImageEditor";

interface TextCustomizerProps {
  options: TextOptions;
  onChange: (options: TextOptions) => void;
}

export const TextCustomizer = ({ options, onChange }: TextCustomizerProps) => {
  const fontFamilies = [
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
  ];

  return (
    <div className="space-y-4">
      {/* Font Size */}
      <div className="space-y-2">
        <Label htmlFor="fontSize" className="text-sm font-medium">
          Font Size
        </Label>
        <Input
          id="fontSize"
          type="number"
          min="8"
          max="72"
          value={options.fontSize}
          onChange={(e) =>
            onChange({ ...options, fontSize: parseInt(e.target.value) || 16 })
          }
          className="h-8"
        />
      </div>

      {/* Font Family */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Font Family</Label>
        <Select
          value={options.fontFamily}
          onValueChange={(value) => onChange({ ...options, fontFamily: value })}
        >
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map((font) => (
              <SelectItem key={font} value={font}>
                <span style={{ fontFamily: font }}>{font}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bold Toggle */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Style</Label>
        <Button
          variant={options.bold ? "default" : "outline"}
          size="sm"
          onClick={() => onChange({ ...options, bold: !options.bold })}
          className="w-full justify-start"
        >
          <Bold className="w-4 h-4 mr-2" />
          Bold
        </Button>
      </div>

      {/* Alignment */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Alignment</Label>
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
                className="flex-1"
              >
                <Icon className="w-4 h-4" />
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};