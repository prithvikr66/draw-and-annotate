import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
}

export const ImageUpload = ({ onImageUpload }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      onImageUpload(imageUrl);
      toast.success("Image uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-8 bg-background shadow-lg">
      <div className="text-center">
        <div className="mb-6">
          <div className="mx-auto w-24 h-24 bg-accent rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-12 h-12 text-accent-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Upload Your Image</h2>
          <p className="text-muted-foreground">
            Choose an image to start annotating with our powerful tools
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleUploadClick}
            size="lg"
            className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-3"
          >
            <Upload className="w-5 h-5 mr-2" />
            Select Image
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Supports JPG, PNG, GIF, and other image formats
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </Card>
  );
};