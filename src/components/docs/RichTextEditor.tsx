import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  CheckSquare,
  Minus,
  Upload,
  Loader2,
  Type,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  align?: "left" | "center" | "right";
  imageUrl?: string;
}

interface RichTextEditorProps {
  initialContent?: ContentBlock[];
  onChange?: (blocks: ContentBlock[]) => void;
  readOnly?: boolean;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

const defaultBlocks: ContentBlock[] = [
  { id: "1", type: "paragraph", content: "" },
];

// Parse markdown to blocks
function parseMarkdownToBlocks(markdown: string): ContentBlock[] {
  const lines = markdown.split("\n");
  const blocks: ContentBlock[] = [];
  let codeBlock = false;
  let codeContent = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block handling
    if (line.startsWith("```")) {
      if (codeBlock) {
        blocks.push({
          id: Math.random().toString(36).substring(2, 11),
          type: "code",
          content: codeContent.trim(),
        });
        codeContent = "";
        codeBlock = false;
      } else {
        codeBlock = true;
      }
      continue;
    }

    if (codeBlock) {
      codeContent += line + "\n";
      continue;
    }

    // Empty line
    if (!line.trim()) {
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      blocks.push({
        id: Math.random().toString(36).substring(2, 11),
        type: "heading3",
        content: line.slice(4),
      });
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({
        id: Math.random().toString(36).substring(2, 11),
        type: "heading2",
        content: line.slice(3),
      });
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push({
        id: Math.random().toString(36).substring(2, 11),
        type: "heading1",
        content: line.slice(2),
      });
      continue;
    }

    // Quote
    if (line.startsWith("> ")) {
      blocks.push({
        id: Math.random().toString(36).substring(2, 11),
        type: "quote",
        content: line.slice(2),
      });
      continue;
    }

    // Horizontal rule
    if (line.match(/^(-{3,}|\*{3,}|_{3,})$/)) {
      blocks.push({
        id: Math.random().toString(36).substring(2, 11),
        type: "divider",
        content: "",
      });
      continue;
    }

    // Checklist
    if (line.match(/^- \[([ x])\] /)) {
      const checked = line.includes("[x]");
      blocks.push({
        id: Math.random().toString(36).substring(2, 11),
        type: "checkList",
        content: line.replace(/^- \[[ x]\] /, ""),
        checked,
      });
      continue;
    }

    // Bullet list
    if (line.match(/^[-*+] /)) {
      blocks.push({
        id: Math.random().toString(36).substring(2, 11),
        type: "bulletList",
        content: line.replace(/^[-*+] /, ""),
      });
      continue;
    }

    // Numbered list
    if (line.match(/^\d+\. /)) {
      blocks.push({
        id: Math.random().toString(36).substring(2, 11),
        type: "numberedList",
        content: line.replace(/^\d+\. /, ""),
      });
      continue;
    }

    // Image
    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      blocks.push({
        id: Math.random().toString(36).substring(2, 11),
        type: "image",
        content: imageMatch[1],
        imageUrl: imageMatch[2],
      });
      continue;
    }

    // Paragraph (default)
    blocks.push({
      id: Math.random().toString(36).substring(2, 11),
      type: "paragraph",
      content: line,
    });
  }

  return blocks.length > 0 ? blocks : defaultBlocks;
}

export function RichTextEditor({
  initialContent = defaultBlocks,
  onChange,
  readOnly = false,
  placeholder = "Comece a escrever...",
  onImageUpload,
}: RichTextEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialContent);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBlocks(initialContent);
  }, [initialContent]);

  const generateId = () => Math.random().toString(36).substring(2, 11);

  const updateBlock = useCallback(
    (id: string, updates: Partial<ContentBlock>) => {
      setBlocks((prev) => {
        const newBlocks = prev.map((block) =>
          block.id === id ? { ...block, ...updates } : block
        );
        onChange?.(newBlocks);
        return newBlocks;
      });
    },
    [onChange]
  );

  const addBlockAfter = useCallback(
    (id: string, type: ContentBlock["type"] = "paragraph") => {
      const newBlock: ContentBlock = {
        id: generateId(),
        type,
        content: "",
      };
      setBlocks((prev) => {
        const index = prev.findIndex((b) => b.id === id);
        const newBlocks = [
          ...prev.slice(0, index + 1),
          newBlock,
          ...prev.slice(index + 1),
        ];
        onChange?.(newBlocks);
        return newBlocks;
      });
      setActiveBlockId(newBlock.id);
      setTimeout(() => {
        blockRefs.current[newBlock.id]?.focus();
      }, 0);
    },
    [onChange]
  );

  const removeBlock = useCallback(
    (id: string) => {
      setBlocks((prev) => {
        if (prev.length <= 1) return prev;
        const index = prev.findIndex((b) => b.id === id);
        const newBlocks = prev.filter((b) => b.id !== id);
        onChange?.(newBlocks);
        if (index > 0) {
          setTimeout(() => {
            blockRefs.current[newBlocks[index - 1].id]?.focus();
          }, 0);
        }
        return newBlocks;
      });
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, block: ContentBlock) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        addBlockAfter(block.id);
      } else if (e.key === "Backspace" && block.content === "") {
        e.preventDefault();
        removeBlock(block.id);
      } else if (e.key === "/" && block.content === "") {
        e.preventDefault();
        setShowSlashMenu(true);
        const rect = blockRefs.current[block.id]?.getBoundingClientRect();
        if (rect) {
          setSlashMenuPosition({ x: rect.left, y: rect.bottom + 8 });
        }
      } else if (e.key === "Escape") {
        setShowSlashMenu(false);
      }
    },
    [addBlockAfter, removeBlock]
  );

  const handleToolbarAction = useCallback((action: string) => {
    const currentBlock = blocks.find(b => b.id === activeBlockId);
    if (!currentBlock && blocks.length > 0) {
      setActiveBlockId(blocks[0].id);
    }

    const targetId = activeBlockId || blocks[0]?.id;
    if (!targetId) return;

    switch (action) {
      case "heading1":
      case "heading2":
      case "heading3":
      case "paragraph":
      case "bulletList":
      case "numberedList":
      case "checkList":
      case "quote":
      case "code":
        updateBlock(targetId, { type: action as ContentBlock["type"] });
        break;
      case "divider":
        addBlockAfter(targetId, "divider");
        break;
      case "image":
        fileInputRef.current?.click();
        break;
      case "alignLeft":
        updateBlock(targetId, { align: "left" });
        break;
      case "alignCenter":
        updateBlock(targetId, { align: "center" });
        break;
      case "alignRight":
        updateBlock(targetId, { align: "right" });
        break;
    }
    setShowSlashMenu(false);
  }, [activeBlockId, blocks, updateBlock, addBlockAfter]);

  const handleSlashCommand = useCallback(
    (type: ContentBlock["type"]) => {
      if (activeBlockId) {
        if (type === "image") {
          updateBlock(activeBlockId, { type: "image", content: "" });
          setTimeout(() => fileInputRef.current?.click(), 100);
        } else {
          updateBlock(activeBlockId, { type, content: "" });
        }
      }
      setShowSlashMenu(false);
    },
    [activeBlockId, updateBlock]
  );

  const handleImageFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetId = activeBlockId || blocks[blocks.length - 1]?.id;
    if (!file || !targetId || !onImageUpload) return;

    setUploadingBlockId(targetId);
    try {
      const imageUrl = await onImageUpload(file);
      updateBlock(targetId, { type: "image", imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploadingBlockId(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [activeBlockId, blocks, onImageUpload, updateBlock]);

  // Handle paste for markdown
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text/plain");
    
    // Check if it looks like markdown
    const hasMarkdown = text.match(/^#{1,3} |^[-*+] |^\d+\. |^> |```|^---/m);
    
    if (hasMarkdown) {
      e.preventDefault();
      const parsedBlocks = parseMarkdownToBlocks(text);
      setBlocks(parsedBlocks);
      onChange?.(parsedBlocks);
    }
  }, [onChange]);

  const slashCommands = [
    { type: "paragraph", icon: Type, label: "Texto", description: "Texto normal" },
    { type: "heading1", icon: Heading1, label: "Título 1", description: "Título grande" },
    { type: "heading2", icon: Heading2, label: "Título 2", description: "Título médio" },
    { type: "heading3", icon: Heading3, label: "Título 3", description: "Título pequeno" },
    { type: "bulletList", icon: List, label: "Lista", description: "Lista com marcadores" },
    { type: "numberedList", icon: ListOrdered, label: "Lista numerada", description: "Lista ordenada" },
    { type: "checkList", icon: CheckSquare, label: "Lista de tarefas", description: "Com caixas de seleção" },
    { type: "quote", icon: Quote, label: "Citação", description: "Texto em destaque" },
    { type: "code", icon: Code, label: "Código", description: "Bloco de código" },
    { type: "divider", icon: Minus, label: "Divisor", description: "Linha horizontal" },
    { type: "image", icon: Image, label: "Imagem", description: "Adicionar imagem" },
  ] as const;

  const getBlockAlignment = (block: ContentBlock) => {
    switch (block.align) {
      case "center": return "text-center";
      case "right": return "text-right";
      default: return "text-left";
    }
  };

  const renderBlock = (block: ContentBlock, index: number) => {
    const commonProps = {
      ref: (el: HTMLDivElement | null) => {
        blockRefs.current[block.id] = el;
      },
      contentEditable: !readOnly && block.type !== "divider" && block.type !== "image",
      suppressContentEditableWarning: true,
      onFocus: () => setActiveBlockId(block.id),
      onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => handleKeyDown(e, block),
      onInput: (e: React.FormEvent<HTMLDivElement>) => {
        updateBlock(block.id, { content: e.currentTarget.textContent || "" });
      },
      "data-placeholder": block.content === "" ? placeholder : undefined,
    };

    const baseClasses = cn(
      "outline-none min-h-[1.5em] empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50",
      getBlockAlignment(block)
    );

    switch (block.type) {
      case "heading1":
        return (
          <div {...commonProps} className={cn(baseClasses, "text-3xl font-bold my-4 text-foreground")}>
            {block.content}
          </div>
        );
      case "heading2":
        return (
          <div {...commonProps} className={cn(baseClasses, "text-2xl font-semibold my-3 text-foreground")}>
            {block.content}
          </div>
        );
      case "heading3":
        return (
          <div {...commonProps} className={cn(baseClasses, "text-xl font-medium my-2 text-foreground")}>
            {block.content}
          </div>
        );
      case "bulletList":
        return (
          <div className="flex items-start gap-3 my-1">
            <span className="text-primary mt-1.5 text-lg">•</span>
            <div {...commonProps} className={cn(baseClasses, "flex-1 text-foreground")}>
              {block.content}
            </div>
          </div>
        );
      case "numberedList":
        const numIndex = blocks.filter((b, i) => b.type === "numberedList" && i <= index).length;
        return (
          <div className="flex items-start gap-3 my-1">
            <span className="text-primary font-medium min-w-[1.5em]">{numIndex}.</span>
            <div {...commonProps} className={cn(baseClasses, "flex-1 text-foreground")}>
              {block.content}
            </div>
          </div>
        );
      case "checkList":
        return (
          <div className="flex items-start gap-3 my-1">
            <input
              type="checkbox"
              checked={block.checked}
              onChange={(e) => updateBlock(block.id, { checked: e.target.checked })}
              className="mt-1.5 h-4 w-4 rounded border-primary text-primary focus:ring-primary"
              disabled={readOnly}
            />
            <div
              {...commonProps}
              className={cn(baseClasses, "flex-1", block.checked && "line-through text-muted-foreground")}
            >
              {block.content}
            </div>
          </div>
        );
      case "quote":
        return (
          <div className="border-l-4 border-primary pl-4 my-3 py-1 bg-primary/5 rounded-r">
            <div {...commonProps} className={cn(baseClasses, "italic text-foreground/80")}>
              {block.content}
            </div>
          </div>
        );
      case "code":
        return (
          <div className="bg-muted rounded-lg p-4 my-3 font-mono text-sm border">
            <div {...commonProps} className={cn(baseClasses, "whitespace-pre-wrap text-foreground")}>
              {block.content}
            </div>
          </div>
        );
      case "divider":
        return <hr className="my-6 border-border" />;
      case "image":
        const isUploading = uploadingBlockId === block.id;
        return (
          <div className="my-4">
            {isUploading ? (
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center bg-primary/5">
                <Loader2 className="w-8 h-8 mx-auto mb-2 text-primary animate-spin" />
                <p className="text-muted-foreground">Enviando imagem...</p>
              </div>
            ) : block.imageUrl ? (
              <div className={cn("relative group", getBlockAlignment(block))}>
                <img
                  src={block.imageUrl}
                  alt={block.content || "Image"}
                  className="max-w-full rounded-lg shadow-md inline-block"
                />
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => {
                  setActiveBlockId(block.id);
                  fileInputRef.current?.click();
                }}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Clique para fazer upload</p>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div {...commonProps} className={cn(baseClasses, "my-1 text-foreground leading-relaxed")}>
            {block.content}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex items-center gap-0.5 p-2 border-b bg-muted/30 flex-wrap sticky top-0 z-10">
          <TooltipProvider delayDuration={300}>
            {/* Block type dropdown */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Type className="w-4 h-4" />
                      <span className="text-xs hidden sm:inline">Bloco</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Tipo de bloco</TooltipContent>
              </Tooltip>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleToolbarAction("paragraph")}>
                  <Type className="w-4 h-4 mr-2" /> Parágrafo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToolbarAction("heading1")}>
                  <Heading1 className="w-4 h-4 mr-2" /> Título 1
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToolbarAction("heading2")}>
                  <Heading2 className="w-4 h-4 mr-2" /> Título 2
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToolbarAction("heading3")}>
                  <Heading3 className="w-4 h-4 mr-2" /> Título 3
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Lists */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarAction("bulletList")}>
                  <List className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Lista com marcadores</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarAction("numberedList")}>
                  <ListOrdered className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Lista numerada</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarAction("checkList")}>
                  <CheckSquare className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Lista de tarefas</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Alignment */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarAction("alignLeft")}>
                  <AlignLeft className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Alinhar à esquerda</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarAction("alignCenter")}>
                  <AlignCenter className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Centralizar</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarAction("alignRight")}>
                  <AlignRight className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Alinhar à direita</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Extras */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarAction("quote")}>
                  <Quote className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Citação</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarAction("code")}>
                  <Code className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Código</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarAction("divider")}>
                  <Minus className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Divisor</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarAction("image")}>
                  <Image className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Imagem</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Editor content */}
      <div 
        ref={editorRef} 
        className="flex-1 p-6"
        onPaste={handlePaste}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageFileSelect}
        />

        {blocks.map((block, index) => (
          <div key={block.id}>
            {renderBlock(block, index)}
          </div>
        ))}

        {/* Slash command menu */}
        {showSlashMenu && (
          <div
            className="fixed z-50 bg-popover border rounded-lg shadow-lg p-2 min-w-[250px] max-h-[350px] overflow-y-auto"
            style={{ left: slashMenuPosition.x, top: slashMenuPosition.y }}
          >
            <p className="text-xs text-muted-foreground px-2 pb-2 border-b mb-2">Blocos básicos</p>
            {slashCommands.map((cmd) => (
              <button
                key={cmd.type}
                onClick={() => handleSlashCommand(cmd.type)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-accent text-left transition-colors"
              >
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                  <cmd.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">{cmd.label}</p>
                  <p className="text-xs text-muted-foreground">{cmd.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
