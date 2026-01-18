import React, { useState, useCallback, useRef, useEffect, forwardRef } from "react";
import {
  List,
  ListOrdered,
  Image,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  Minus,
  Upload,
  Loader2,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface ContentBlock {
  id: string;
  type: "paragraph" | "heading1" | "heading2" | "heading3" | "bulletList" | "numberedList" | "checkList" | "quote" | "code" | "divider" | "image";
  content: string;
  checked?: boolean;
  imageUrl?: string;
}

interface SimpleEditorProps {
  initialContent?: ContentBlock[];
  onChange?: (blocks: ContentBlock[]) => void;
  readOnly?: boolean;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

const defaultBlocks: ContentBlock[] = [
  { id: "1", type: "paragraph", content: "" },
];

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

// Parse markdown text to blocks
function parseMarkdown(text: string): ContentBlock[] {
  const lines = text.split("\n");
  const blocks: ContentBlock[] = [];
  let inCodeBlock = false;
  let codeContent = "";

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        blocks.push({ id: generateId(), type: "code", content: codeContent.trim() });
        codeContent = "";
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + "\n";
      continue;
    }

    if (!line.trim()) continue;

    if (line.startsWith("### ")) {
      blocks.push({ id: generateId(), type: "heading3", content: line.slice(4) });
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ id: generateId(), type: "heading2", content: line.slice(3) });
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push({ id: generateId(), type: "heading1", content: line.slice(2) });
      continue;
    }

    if (line.startsWith("> ")) {
      blocks.push({ id: generateId(), type: "quote", content: line.slice(2) });
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      blocks.push({ id: generateId(), type: "divider", content: "" });
      continue;
    }

    if (/^- \[([ x])\] /.test(line)) {
      blocks.push({
        id: generateId(),
        type: "checkList",
        content: line.replace(/^- \[[ x]\] /, ""),
        checked: line.includes("[x]"),
      });
      continue;
    }

    if (/^[-*+] /.test(line)) {
      blocks.push({ id: generateId(), type: "bulletList", content: line.replace(/^[-*+] /, "") });
      continue;
    }

    if (/^\d+\. /.test(line)) {
      blocks.push({ id: generateId(), type: "numberedList", content: line.replace(/^\d+\. /, "") });
      continue;
    }

    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      blocks.push({ id: generateId(), type: "image", content: imgMatch[1], imageUrl: imgMatch[2] });
      continue;
    }

    blocks.push({ id: generateId(), type: "paragraph", content: line });
  }

  return blocks.length > 0 ? blocks : defaultBlocks;
}

// Block component for each content block
interface BlockProps {
  block: ContentBlock;
  index: number;
  blocks: ContentBlock[];
  placeholder: string;
  readOnly: boolean;
  uploadingId: string | null;
  onUpdate: (id: string, updates: Partial<ContentBlock>) => void;
  onKeyDown: (e: React.KeyboardEvent, block: ContentBlock) => void;
  onFocus: (id: string) => void;
  onImageClick: (id: string) => void;
}

function EditorBlock({
  block,
  index,
  blocks,
  placeholder,
  readOnly,
  uploadingId,
  onUpdate,
  onKeyDown,
  onFocus,
  onImageClick,
}: BlockProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle input events manually to preserve cursor position
  const handleInput = useCallback(() => {
    if (contentRef.current) {
      const text = contentRef.current.innerText || "";
      onUpdate(block.id, { content: text });
    }
  }, [block.id, onUpdate]);

  // Set initial content
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerText !== block.content) {
      // Only update if different to avoid cursor jumping
      const selection = window.getSelection();
      const hadFocus = document.activeElement === contentRef.current;
      
      if (!hadFocus) {
        contentRef.current.innerText = block.content;
      }
    }
  }, [block.content]);

  const baseClass = "outline-none focus:outline-none cursor-text";
  const placeholderClass = block.content === "" 
    ? "before:content-[attr(data-placeholder)] before:text-muted-foreground/50 before:absolute before:pointer-events-none" 
    : "";

  const commonProps = {
    ref: contentRef,
    contentEditable: !readOnly && block.type !== "divider" && block.type !== "image",
    suppressContentEditableWarning: true,
    onFocus: () => onFocus(block.id),
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => onKeyDown(e, block),
    onInput: handleInput,
    "data-placeholder": block.content === "" ? placeholder : undefined,
    style: { userSelect: "text" as const, WebkitUserSelect: "text" as const },
  };

  switch (block.type) {
    case "heading1":
      return (
        <div
          {...commonProps}
          className={cn(baseClass, placeholderClass, "text-3xl font-bold my-4 min-h-[2.5rem] relative")}
        />
      );
    case "heading2":
      return (
        <div
          {...commonProps}
          className={cn(baseClass, placeholderClass, "text-2xl font-semibold my-3 min-h-[2rem] relative")}
        />
      );
    case "heading3":
      return (
        <div
          {...commonProps}
          className={cn(baseClass, placeholderClass, "text-xl font-medium my-2 min-h-[1.75rem] relative")}
        />
      );
    case "bulletList":
      return (
        <div className="flex gap-3 my-1">
          <span className="text-primary text-lg leading-relaxed select-none flex-shrink-0">•</span>
          <div
            {...commonProps}
            className={cn(baseClass, placeholderClass, "flex-1 min-h-[1.5rem] relative")}
          />
        </div>
      );
    case "numberedList": {
      const num = blocks.slice(0, index + 1).filter(b => b.type === "numberedList").length;
      return (
        <div className="flex gap-3 my-1">
          <span className="text-primary font-medium min-w-[1.5em] select-none flex-shrink-0">{num}.</span>
          <div
            {...commonProps}
            className={cn(baseClass, placeholderClass, "flex-1 min-h-[1.5rem] relative")}
          />
        </div>
      );
    }
    case "checkList":
      return (
        <div className="flex gap-3 my-1 items-start">
          <input
            type="checkbox"
            checked={block.checked || false}
            onChange={(e) => onUpdate(block.id, { checked: e.target.checked })}
            disabled={readOnly}
            className="mt-1 h-4 w-4 rounded border-primary text-primary flex-shrink-0"
          />
          <div
            {...commonProps}
            className={cn(
              baseClass,
              placeholderClass,
              "flex-1 min-h-[1.5rem] relative",
              block.checked && "line-through text-muted-foreground"
            )}
          />
        </div>
      );
    case "quote":
      return (
        <blockquote className="border-l-4 border-primary pl-4 my-3 py-1 bg-primary/5 rounded-r">
          <div
            {...commonProps}
            className={cn(baseClass, placeholderClass, "italic text-foreground/80 min-h-[1.5rem] relative")}
          />
        </blockquote>
      );
    case "code":
      return (
        <pre className="bg-muted rounded-lg p-4 my-3 font-mono text-sm border overflow-x-auto">
          <code
            {...commonProps}
            className={cn(baseClass, placeholderClass, "whitespace-pre-wrap block min-h-[1.5rem] relative")}
          />
        </pre>
      );
    case "divider":
      return <hr className="my-6 border-border" />;
    case "image":
      if (uploadingId === block.id) {
        return (
          <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center bg-primary/5 my-4">
            <Loader2 className="w-8 h-8 mx-auto mb-2 text-primary animate-spin" />
            <p className="text-muted-foreground">Enviando imagem...</p>
          </div>
        );
      }
      if (block.imageUrl) {
        return (
          <div className="my-4">
            <img src={block.imageUrl} alt={block.content || "Imagem"} className="max-w-full rounded-lg shadow-sm" />
          </div>
        );
      }
      return (
        <div
          className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer my-4 hover:border-primary/50 transition-colors"
          onClick={() => onImageClick(block.id)}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Clique para fazer upload</p>
        </div>
      );
    default:
      return (
        <div
          {...commonProps}
          className={cn(baseClass, placeholderClass, "my-1 leading-relaxed min-h-[1.5rem] relative")}
        />
      );
  }
}

// Main editor component with forwardRef
const SimpleEditor = forwardRef<HTMLDivElement, SimpleEditorProps>(function SimpleEditor(
  {
    initialContent = defaultBlocks,
    onChange,
    readOnly = false,
    placeholder = "Comece a escrever...",
    onImageUpload,
  },
  ref
) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialContent);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blockElementsRef = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const initial = JSON.stringify(initialContent);
    const current = JSON.stringify(blocks);
    if (initial !== current) {
      setBlocks(initialContent);
    }
  }, [initialContent]);

  const updateBlocks = useCallback((newBlocks: ContentBlock[]) => {
    setBlocks(newBlocks);
    onChange?.(newBlocks);
  }, [onChange]);

  const updateBlock = useCallback((id: string, updates: Partial<ContentBlock>) => {
    setBlocks(prev => {
      const newBlocks = prev.map(b => b.id === id ? { ...b, ...updates } : b);
      onChange?.(newBlocks);
      return newBlocks;
    });
  }, [onChange]);

  const addBlockAfter = useCallback((id: string, type: ContentBlock["type"] = "paragraph") => {
    const newBlock: ContentBlock = { id: generateId(), type, content: "" };
    setBlocks(prev => {
      const index = prev.findIndex(b => b.id === id);
      const newBlocks = [...prev.slice(0, index + 1), newBlock, ...prev.slice(index + 1)];
      onChange?.(newBlocks);
      return newBlocks;
    });
    
    // Focus new block after render
    setTimeout(() => {
      const el = document.querySelector(`[data-block-id="${newBlock.id}"]`) as HTMLElement;
      if (el) {
        const editable = el.querySelector('[contenteditable="true"]') as HTMLElement;
        if (editable) editable.focus();
      }
    }, 50);
  }, [onChange]);

  const removeBlock = useCallback((id: string) => {
    setBlocks(prev => {
      if (prev.length <= 1) return prev;
      const index = prev.findIndex(b => b.id === id);
      const newBlocks = prev.filter(b => b.id !== id);
      onChange?.(newBlocks);
      
      // Focus previous block
      setTimeout(() => {
        const prevIndex = Math.max(0, index - 1);
        const prevBlock = newBlocks[prevIndex];
        if (prevBlock) {
          const el = document.querySelector(`[data-block-id="${prevBlock.id}"]`) as HTMLElement;
          if (el) {
            const editable = el.querySelector('[contenteditable="true"]') as HTMLElement;
            if (editable) editable.focus();
          }
        }
      }, 50);
      
      return newBlocks;
    });
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, block: ContentBlock) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addBlockAfter(block.id);
    } else if (e.key === "Backspace" && block.content === "") {
      e.preventDefault();
      removeBlock(block.id);
    }
  }, [addBlockAfter, removeBlock]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text/plain");
    if (/^#{1,3} |^[-*+] |^\d+\. |^> |```|^---/m.test(text)) {
      e.preventDefault();
      const parsed = parseMarkdown(text);
      updateBlocks(parsed);
    }
  }, [updateBlocks]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeBlockId || !onImageUpload) return;

    setUploadingId(activeBlockId);
    try {
      const url = await onImageUpload(file);
      updateBlock(activeBlockId, { type: "image", imageUrl: url });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploadingId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [onImageUpload, updateBlock, activeBlockId]);

  const handleImageClick = useCallback((blockId: string) => {
    setActiveBlockId(blockId);
    fileInputRef.current?.click();
  }, []);

  const changeBlockType = useCallback((type: ContentBlock["type"]) => {
    const blockId = activeBlockId || blocks[0]?.id;
    if (!blockId) return;

    if (type === "image") {
      setActiveBlockId(blockId);
      fileInputRef.current?.click();
    } else if (type === "divider") {
      addBlockAfter(blockId, "divider");
    } else {
      updateBlock(blockId, { type });
    }
  }, [blocks, updateBlock, addBlockAfter, activeBlockId]);

  return (
    <div ref={ref} className="flex flex-col h-full">
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex items-center gap-1 p-3 border-b bg-muted/30 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-1.5">
                <Type className="w-4 h-4" />
                <span className="text-sm">Bloco</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => changeBlockType("paragraph")}>
                <Type className="w-4 h-4 mr-2" /> Parágrafo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeBlockType("heading1")}>
                <Heading1 className="w-4 h-4 mr-2" /> Título 1
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeBlockType("heading2")}>
                <Heading2 className="w-4 h-4 mr-2" /> Título 2
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeBlockType("heading3")}>
                <Heading3 className="w-4 h-4 mr-2" /> Título 3
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeBlockType("bulletList")} title="Lista">
            <List className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeBlockType("numberedList")} title="Lista numerada">
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeBlockType("checkList")} title="Checklist">
            <CheckSquare className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeBlockType("quote")} title="Citação">
            <Quote className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeBlockType("code")} title="Código">
            <Code className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeBlockType("divider")} title="Divisor">
            <Minus className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeBlockType("image")} title="Imagem">
            <Image className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Editor content */}
      <div 
        className="flex-1 p-6 overflow-y-auto" 
        onPaste={handlePaste}
        style={{ userSelect: "text", WebkitUserSelect: "text" }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        {blocks.map((block, index) => (
          <div key={block.id} data-block-id={block.id}>
            <EditorBlock
              block={block}
              index={index}
              blocks={blocks}
              placeholder={placeholder}
              readOnly={readOnly}
              uploadingId={uploadingId}
              onUpdate={updateBlock}
              onKeyDown={handleKeyDown}
              onFocus={setActiveBlockId}
              onImageClick={handleImageClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

SimpleEditor.displayName = "SimpleEditor";

export { SimpleEditor };
