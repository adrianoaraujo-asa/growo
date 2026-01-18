// components/docs/Page/PageHeader.tsx
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Image as ImageIcon, 
  Smile, 
  MoreHorizontal, 
  X,
  Sparkles,
  Upload,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Common emojis for quick selection
const COMMON_EMOJIS = [
  "📄", "📝", "📋", "📁", "📂", "📚", "📖", "📓", 
  "✏️", "🖊️", "📌", "📎", "🔗", "💡", "⭐", "🎯",
  "🚀", "💻", "🔧", "⚙️", "🎨", "📊", "📈", "🗂️",
  "✅", "❌", "⚠️", "💬", "📢", "🔔", "🏷️", "🎉",
];

interface PageHeaderProps {
  title: string;
  icon: string | null;
  coverUrl: string | null;
  onTitleChange: (title: string) => void;
  onIconChange: (icon: string | null) => void;
  onCoverChange: (url: string | null) => void;
  onCoverUpload?: (file: File) => Promise<string>;
  editable?: boolean;
}

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCoverOptions, setShowCoverOptions] = useState(false);
  const [coverUrl_, setCoverUrl_] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onCoverUpload) return;

    try {
      const url = await onCoverUpload(file);
      onCoverChange(url);
      setShowCoverOptions(false);
    } catch (error) {
      console.error("Error uploading cover:", error);
    }
  };

  const handleCoverUrlSubmit = () => {
    if (coverUrl_.trim()) {
      onCoverChange(coverUrl_.trim());
      setCoverUrl_("");
      setShowCoverOptions(false);
    }
  };

  const handleRemoveCover = () => {
    onCoverChange(null);
    setShowCoverOptions(false);
  };

  const handleRemoveIcon = () => {
    onIconChange(null);
    setShowEmojiPicker(false);
  };

  return (
    <div className="page-header">
      {/* Cover Image */}
      {coverUrl && (
        <div className="relative h-48 w-full group">
          <img
            src={coverUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          {editable && (
            <motion.div 
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black/30 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowCoverOptions(true)}
              >
                Alterar capa
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleRemoveCover}
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </div>
      )}

      {/* Page Info */}
      <div className={cn("px-4 md:px-16", coverUrl ? "pt-8" : "pt-8")}>
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="relative">
            {icon ? (
              <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <PopoverTrigger asChild>
                  <button
                    className="text-6xl hover:opacity-80 transition-opacity cursor-pointer"
                    disabled={!editable}
                  >
                    {icon}
                  </button>
                </PopoverTrigger>
                {editable && (
                  <PopoverContent className="w-80 p-3" align="start">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Escolher ícone</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveIcon}
                          className="h-7 text-xs"
                        >
                          Remover
                        </Button>
                      </div>
                      <div className="grid grid-cols-8 gap-1">
                        {COMMON_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => {
                              onIconChange(emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="p-2 text-xl hover:bg-accent rounded transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                )}
              </Popover>
            ) : (
              editable && (
                <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Smile className="w-4 h-4 mr-2" />
                      Adicionar ícone
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-3" align="start">
                    <div className="space-y-3">
                      <span className="text-sm font-medium">Escolher ícone</span>
                      <div className="grid grid-cols-8 gap-1">
                        {COMMON_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => {
                              onIconChange(emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="p-2 text-xl hover:bg-accent rounded transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )
            )}
          </div>

          {/* Add Cover Button */}
          {!coverUrl && editable && (
            <Popover open={showCoverOptions} onOpenChange={setShowCoverOptions}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Adicionar capa
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3" align="start">
                <div className="space-y-3">
                  <span className="text-sm font-medium">Adicionar capa</span>
                  
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Fazer upload
                    </Button>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ou cole a URL da imagem"
                        value={coverUrl_}
                        onChange={(e) => setCoverUrl_(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCoverUrlSubmit()}
                      />
                      <Button size="icon" onClick={handleCoverUrlSubmit}>
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Title */}
        <div className="mt-4">
          {editable ? (
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Sem título"
              className="w-full text-4xl font-bold outline-none bg-transparent placeholder:text-muted-foreground/50 focus:placeholder:text-muted-foreground/30"
            />
          ) : (
            <h1 className="text-4xl font-bold">
              {title || "Sem título"}
            </h1>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleCoverUpload}
        className="hidden"
      />
    </div>
  );
}

export default PageHeader;
