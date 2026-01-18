import { useState, useRef } from "react";
import { ImagePlus, Smile, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  icon: string | null;
  coverUrl: string | null;
  onTitleChange: (title: string) => void;
  onIconChange: (icon: string) => void;
  onCoverChange: (url: string | null) => void;
  onCoverUpload?: (file: File) => Promise<string>;
  editable?: boolean;
}

const EMOJI_LIST = [
  "📄", "📝", "📋", "📑", "📊", "📈", "📉", "📌",
  "🎯", "💡", "⭐", "🔥", "💎", "🚀", "💻", "🎨",
  "📚", "🔧", "⚙️", "🔐", "📦", "🎁", "💼", "📱",
  "🌟", "✨", "🎉", "🎊", "🏆", "🥇", "🎖️", "🏅",
];

export function PageHeader({
  title,
  icon,
  coverUrl,
  onTitleChange,
  onIconChange,
  onCoverChange,
  onCoverUpload,
  editable = true,
}: PageHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [coverUrlInput, setCoverUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onCoverUpload) {
      const url = await onCoverUpload(file);
      onCoverChange(url);
    }
  };

  return (
    <div className="relative">
      {/* Cover Image */}
      {coverUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={coverUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          {editable && (
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="h-4 w-4 mr-1" />
                Trocar
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onCoverChange(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Header Content */}
      <div
        className={cn(
          "px-12 py-8",
          coverUrl ? "pt-4" : "pt-16"
        )}
      >
        {/* Icon + Add Cover (when no cover) */}
        <div className="flex items-center gap-2 mb-4">
          {/* Icon Picker */}
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "text-5xl hover:bg-accent/50 rounded-lg p-2 transition-colors",
                  !editable && "pointer-events-none"
                )}
              >
                {icon || "📄"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="grid grid-cols-8 gap-1">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    className="text-xl p-1 hover:bg-accent rounded"
                    onClick={() => {
                      onIconChange(emoji);
                      setShowEmojiPicker(false);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Add Cover Button */}
          {!coverUrl && editable && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <ImagePlus className="h-4 w-4 mr-1" />
                  Adicionar capa
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">URL da imagem</label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        placeholder="https://..."
                        value={coverUrlInput}
                        onChange={(e) => setCoverUrlInput(e.target.value)}
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          if (coverUrlInput) {
                            onCoverChange(coverUrlInput);
                            setCoverUrlInput("");
                          }
                        }}
                      >
                        Adicionar
                      </Button>
                    </div>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">ou</div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="h-4 w-4 mr-2" />
                    Fazer upload
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Title */}
        {editable && isEditingTitle ? (
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
            autoFocus
            className="text-4xl font-bold border-none bg-transparent p-0 h-auto focus-visible:ring-0"
            placeholder="Sem título"
          />
        ) : (
          <h1
            className={cn(
              "text-4xl font-bold",
              editable && "cursor-text hover:bg-accent/30 rounded px-1 -mx-1"
            )}
            onClick={() => editable && setIsEditingTitle(true)}
          >
            {title || "Sem título"}
          </h1>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCoverUpload}
      />
    </div>
  );
}
