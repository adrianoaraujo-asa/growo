import React, { useState, useCallback, useRef, useEffect } from "react";
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
  Plus,
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
    // Code block
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

    // Skip empty lines
    if (!line.trim()) continue;

    // Headings
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

    // Quote
    if (line.startsWith("> ")) {
      blocks.push({ id: generateId(), type: "quote", content: line.slice(2) });
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      blocks.push({ id: generateId(), type: "divider", content: "" });
      continue;
    }

    // Checklist
    if (/^- \[([ x])\] /.test(line)) {
      blocks.push({
        id: generateId(),
        type: "checkList",
        content: line.replace(/^- \[[ x]\] /, ""),
        checked: line.includes("[x]"),
      });
      continue;
    }

    // Bullet list
    if (/^[-*+] /.test(line)) {
      blocks.push({ id: generateId(), type: "bulletList", content: line.replace(/^[-*+] /, "") });
      continue;
    }

    // Numbered list
    if (/^\d+\. /.test(line)) {
      blocks.push({ id: generateId(), type: "numberedList", content: line.replace(/^\d+\. /, "") });
      continue;
    }

    // Image
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      blocks.push({ id: generateId(), type: "image", content: imgMatch[1], imageUrl: imgMatch[2] });
      continue;
    }

    // Default: paragraph
    blocks.push({ id: generateId(), type: "paragraph", content: line });
  }

  return blocks.length > 0 ? blocks : defaultBlocks;
}

export function SimpleEditor({
  initialContent = defaultBlocks,
  onChange,
  readOnly = false,
  placeholder = "Comece a escrever...",
  onImageUpload,
}: SimpleEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialContent);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeBlockRef = useRef<string | null>(null);
  const blockRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (JSON.stringify(initialContent) !== JSON.stringify(blocks)) {
      setBlocks(initialContent);
    }
  }, [initialContent]);

  const updateBlocks = useCallback((newBlocks: ContentBlock[]) => {
    setBlocks(newBlocks);
    onChange?.(newBlocks);
  }, [onChange]);

  const updateBlock = useCallback((id: string, updates: Partial<ContentBlock>) => {
    updateBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  }, [blocks, updateBlocks]);

  const addBlockAfter = useCallback((id: string, type: ContentBlock["type"] = "paragraph") => {
    const newBlock: ContentBlock = { id: generateId(), type, content: "" };
    const index = blocks.findIndex(b => b.id === id);
    const newBlocks = [...blocks.slice(0, index + 1), newBlock, ...blocks.slice(index + 1)];
    updateBlocks(newBlocks);
    setTimeout(() => blockRefs.current[newBlock.id]?.focus(), 10);
  }, [blocks, updateBlocks]);

  const removeBlock = useCallback((id: string) => {
    if (blocks.length <= 1) return;
    const index = blocks.findIndex(b => b.id === id);
    const newBlocks = blocks.filter(b => b.id !== id);
    updateBlocks(newBlocks);
    if (index > 0) {
      setTimeout(() => blockRefs.current[newBlocks[index - 1].id]?.focus(), 10);
    }
  }, [blocks, updateBlocks]);

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
    const blockId = activeBlockRef.current;
    if (!file || !blockId || !onImageUpload) return;

    setUploadingId(blockId);
    try {
      const url = await onImageUpload(file);
      updateBlock(blockId, { type: "image", imageUrl: url });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploadingId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [onImageUpload, updateBlock]);

  const changeBlockType = useCallback((type: ContentBlock["type"]) => {
    const blockId = activeBlockRef.current || blocks[0]?.id;
    if (!blockId) return;

    if (type === "image") {
      activeBlockRef.current = blockId;
      fileInputRef.current?.click();
    } else if (type === "divider") {
      addBlockAfter(blockId, "divider");
    } else {
      updateBlock(blockId, { type });
    }
  }, [blocks, updateBlock, addBlockAfter]);

  const renderBlock = (block: ContentBlock, index: number) => {
    const setRef = (el: HTMLElement | null) => {
      blockRefs.current[block.id] = el;
    };

    const commonProps = {
      ref: setRef,
      contentEditable: !readOnly && block.type !== "divider" && block.type !== "image",
      suppressContentEditableWarning: true,
      onFocus: () => { activeBlockRef.current = block.id; },
      onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => handleKeyDown(e, block),
      onInput: (e: React.FormEvent<HTMLElement>) => {
        updateBlock(block.id, { content: e.currentTarget.textContent || "" });
      },
      "data-placeholder": block.content === "" ? placeholder : undefined,
    };

    const baseClass = "outline-none min-h-[1.5em] empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50";

    switch (block.type) {
      case "heading1":
        return <h1 {...commonProps} className={cn(baseClass, "text-3xl font-bold my-4")}>{block.content}</h1>;
      case "heading2":
        return <h2 {...commonProps} className={cn(baseClass, "text-2xl font-semibold my-3")}>{block.content}</h2>;
      case "heading3":
        return <h3 {...commonProps} className={cn(baseClass, "text-xl font-medium my-2")}>{block.content}</h3>;
      case "bulletList":
        return (
          <div className="flex gap-3 my-1">
            <span className="text-primary text-lg leading-relaxed">•</span>
            <p {...commonProps} className={cn(baseClass, "flex-1")}>{block.content}</p>
          </div>
        );
      case "numberedList":
        const num = blocks.slice(0, index + 1).filter(b => b.type === "numberedList").length;
        return (
          <div className="flex gap-3 my-1">
            <span className="text-primary font-medium min-w-[1.5em]">{num}.</span>
            <p {...commonProps} className={cn(baseClass, "flex-1")}>{block.content}</p>
          </div>
        );
      case "checkList":
        return (
          <div className="flex gap-3 my-1 items-start">
            <input
              type="checkbox"
              checked={block.checked || false}
              onChange={(e) => updateBlock(block.id, { checked: e.target.checked })}
              disabled={readOnly}
              className="mt-1 h-4 w-4 rounded border-primary text-primary"
            />
            <p {...commonProps} className={cn(baseClass, "flex-1", block.checked && "line-through text-muted-foreground")}>
              {block.content}
            </p>
          </div>
        );
      case "quote":
        return (
          <blockquote className="border-l-4 border-primary pl-4 my-3 py-1 bg-primary/5 rounded-r">
            <p {...commonProps} className={cn(baseClass, "italic text-foreground/80")}>{block.content}</p>
          </blockquote>
        );
      case "code":
        return (
          <pre className="bg-muted rounded-lg p-4 my-3 font-mono text-sm border">
            <code {...commonProps} className={cn(baseClass, "whitespace-pre-wrap block")}>{block.content}</code>
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
            className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer my-4"
            onClick={() => {
              activeBlockRef.current = block.id;
              fileInputRef.current?.click();
            }}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Clique para fazer upload</p>
          </div>
        );
      default:
        return <p {...commonProps} className={cn(baseClass, "my-1 leading-relaxed")}>{block.content}</p>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex items-center gap-1 p-3 border-b bg-muted/30">
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

      {/* Editor */}
      <div className="flex-1 p-6" onPaste={handlePaste}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        {blocks.map((block, index) => (
          <div key={block.id}>{renderBlock(block, index)}</div>
        ))}
      </div>
    </div>
  );
}
