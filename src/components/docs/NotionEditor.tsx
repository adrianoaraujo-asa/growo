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
  CheckSquare,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table,
  FileText,
  Upload,
  Type,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NotionBlock {
  id: string;
  type: "paragraph" | "heading1" | "heading2" | "heading3" | "bulletList" | "numberedList" | "checkList" | "quote" | "code" | "divider" | "image" | "table";
  content: string;
  checked?: boolean;
  align?: "left" | "center" | "right";
  imageUrl?: string;
  tableData?: string[][];
}

interface NotionEditorProps {
  initialContent?: NotionBlock[];
  onChange?: (blocks: NotionBlock[]) => void;
  readOnly?: boolean;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

const defaultBlocks: NotionBlock[] = [
  { id: "1", type: "paragraph", content: "" },
];

export function NotionEditor({
  initialContent = defaultBlocks,
  onChange,
  readOnly = false,
  placeholder = "Digite '/' para comandos...",
  onImageUpload,
}: NotionEditorProps) {
  const [blocks, setBlocks] = useState<NotionBlock[]>(initialContent);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const [slashFilter, setSlashFilter] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const generateId = () => Math.random().toString(36).substring(2, 11);

  const updateBlock = useCallback(
    (id: string, updates: Partial<NotionBlock>) => {
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
    (id: string, type: NotionBlock["type"] = "paragraph") => {
      const newBlock: NotionBlock = {
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
        
        // Focus previous block
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
    (e: React.KeyboardEvent, block: NotionBlock) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        addBlockAfter(block.id);
      } else if (e.key === "Backspace" && block.content === "") {
        e.preventDefault();
        removeBlock(block.id);
      } else if (e.key === "/" && block.content === "") {
        setShowSlashMenu(true);
        setSlashFilter("");
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

  const handleSlashCommand = useCallback(
    (type: NotionBlock["type"]) => {
      if (activeBlockId) {
        updateBlock(activeBlockId, { type, content: "" });
      }
      setShowSlashMenu(false);
    },
    [activeBlockId, updateBlock]
  );

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

  const filteredCommands = slashCommands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(slashFilter.toLowerCase()) ||
      cmd.description.toLowerCase().includes(slashFilter.toLowerCase())
  );

  const renderBlock = (block: NotionBlock) => {
    const commonProps = {
      ref: (el: HTMLDivElement | null) => {
        blockRefs.current[block.id] = el;
      },
      contentEditable: !readOnly,
      suppressContentEditableWarning: true,
      onFocus: () => setActiveBlockId(block.id),
      onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => handleKeyDown(e, block),
      onInput: (e: React.FormEvent<HTMLDivElement>) => {
        updateBlock(block.id, { content: e.currentTarget.textContent || "" });
      },
      "data-placeholder": block.content === "" ? placeholder : undefined,
    };

    const baseClasses = "outline-none min-h-[1.5em] empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50";

    switch (block.type) {
      case "heading1":
        return (
          <div
            {...commonProps}
            className={cn(baseClasses, "text-3xl font-bold my-4")}
          >
            {block.content}
          </div>
        );
      case "heading2":
        return (
          <div
            {...commonProps}
            className={cn(baseClasses, "text-2xl font-semibold my-3")}
          >
            {block.content}
          </div>
        );
      case "heading3":
        return (
          <div
            {...commonProps}
            className={cn(baseClasses, "text-xl font-medium my-2")}
          >
            {block.content}
          </div>
        );
      case "bulletList":
        return (
          <div className="flex items-start gap-2 my-1">
            <span className="text-muted-foreground mt-1">•</span>
            <div {...commonProps} className={cn(baseClasses, "flex-1")}>
              {block.content}
            </div>
          </div>
        );
      case "numberedList":
        const index = blocks.filter((b, i) => b.type === "numberedList" && i <= blocks.indexOf(block)).length;
        return (
          <div className="flex items-start gap-2 my-1">
            <span className="text-muted-foreground min-w-[1.5em]">{index}.</span>
            <div {...commonProps} className={cn(baseClasses, "flex-1")}>
              {block.content}
            </div>
          </div>
        );
      case "checkList":
        return (
          <div className="flex items-start gap-2 my-1">
            <input
              type="checkbox"
              checked={block.checked}
              onChange={(e) => updateBlock(block.id, { checked: e.target.checked })}
              className="mt-1 rounded border-muted-foreground/50"
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
          <div className="border-l-4 border-primary/30 pl-4 my-2">
            <div {...commonProps} className={cn(baseClasses, "italic text-muted-foreground")}>
              {block.content}
            </div>
          </div>
        );
      case "code":
        return (
          <div className="bg-muted rounded-lg p-4 my-2 font-mono text-sm">
            <div {...commonProps} className={cn(baseClasses, "whitespace-pre-wrap")}>
              {block.content}
            </div>
          </div>
        );
      case "divider":
        return <hr className="my-4 border-border" />;
      case "image":
        return (
          <div className="my-4">
            {block.imageUrl ? (
              <img
                src={block.imageUrl}
                alt={block.content || "Image"}
                className="max-w-full rounded-lg"
              />
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Clique para fazer upload</p>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div {...commonProps} className={cn(baseClasses, "my-1")}>
            {block.content}
          </div>
        );
    }
  };

  return (
    <div ref={editorRef} className="relative min-h-[400px] p-4">
      {blocks.map((block) => (
        <div
          key={block.id}
          className={cn(
            "group relative",
            activeBlockId === block.id && "bg-accent/30 -mx-2 px-2 rounded"
          )}
        >
          {/* Block handle (optional) */}
          {!readOnly && (
            <div className="absolute -left-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="text-muted-foreground">
                  <circle cx="4" cy="3" r="1.5" />
                  <circle cx="10" cy="3" r="1.5" />
                  <circle cx="4" cy="7" r="1.5" />
                  <circle cx="10" cy="7" r="1.5" />
                  <circle cx="4" cy="11" r="1.5" />
                  <circle cx="10" cy="11" r="1.5" />
                </svg>
              </Button>
            </div>
          )}
          {renderBlock(block)}
        </div>
      ))}

      {/* Slash command menu */}
      {showSlashMenu && (
        <div
          className="fixed z-50 bg-popover border rounded-lg shadow-lg p-1 min-w-[250px]"
          style={{ left: slashMenuPosition.x, top: slashMenuPosition.y }}
        >
          <Input
            value={slashFilter}
            onChange={(e) => setSlashFilter(e.target.value)}
            placeholder="Filtrar..."
            className="mb-2"
            autoFocus
          />
          <div className="max-h-[300px] overflow-y-auto">
            {filteredCommands.map((cmd) => (
              <button
                key={cmd.type}
                onClick={() => handleSlashCommand(cmd.type)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-accent text-left"
              >
                <cmd.icon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{cmd.label}</p>
                  <p className="text-xs text-muted-foreground">{cmd.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
