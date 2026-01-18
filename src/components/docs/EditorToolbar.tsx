import React from "react";
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
  Table,
  Minus,
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

interface ToolbarButton {
  icon: React.ElementType;
  label: string;
  action?: string;
  type?: "button" | "separator" | "dropdown";
  items?: Array<{ icon: React.ElementType; label: string; action: string }>;
}

const toolbarButtons: ToolbarButton[] = [
  { icon: Undo, label: "Desfazer", action: "undo" },
  { icon: Redo, label: "Refazer", action: "redo" },
  { type: "separator", icon: Minus, label: "" },
  { icon: Bold, label: "Negrito (Ctrl+B)", action: "bold" },
  { icon: Italic, label: "Itálico (Ctrl+I)", action: "italic" },
  { icon: Underline, label: "Sublinhado (Ctrl+U)", action: "underline" },
  { icon: Strikethrough, label: "Tachado", action: "strikethrough" },
  { type: "separator", icon: Minus, label: "" },
  {
    icon: Heading1,
    label: "Títulos",
    type: "dropdown",
    items: [
      { icon: Heading1, label: "Título 1", action: "heading1" },
      { icon: Heading2, label: "Título 2", action: "heading2" },
      { icon: Heading3, label: "Título 3", action: "heading3" },
    ],
  },
  { type: "separator", icon: Minus, label: "" },
  { icon: List, label: "Lista", action: "bulletList" },
  { icon: ListOrdered, label: "Lista numerada", action: "numberedList" },
  { icon: CheckSquare, label: "Lista de tarefas", action: "checkList" },
  { type: "separator", icon: Minus, label: "" },
  { icon: AlignLeft, label: "Alinhar à esquerda", action: "alignLeft" },
  { icon: AlignCenter, label: "Centralizar", action: "alignCenter" },
  { icon: AlignRight, label: "Alinhar à direita", action: "alignRight" },
  { type: "separator", icon: Minus, label: "" },
  { icon: Link, label: "Link", action: "link" },
  { icon: Image, label: "Imagem", action: "image" },
  { icon: Code, label: "Código", action: "code" },
  { icon: Quote, label: "Citação", action: "quote" },
  { icon: Table, label: "Tabela", action: "table" },
  { icon: Minus, label: "Divisor", action: "divider" },
];

interface EditorToolbarProps {
  onAction?: (action: string) => void;
  activeFormats?: string[];
  className?: string;
}

export function EditorToolbar({
  onAction,
  activeFormats = [],
  className,
}: EditorToolbarProps) {
  const handleAction = (action: string) => {
    onAction?.(action);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 p-1.5 border-b bg-background flex-wrap",
        className
      )}
    >
      <TooltipProvider delayDuration={300}>
        {toolbarButtons.map((btn, index) => {
          if (btn.type === "separator") {
            return (
              <Separator
                key={index}
                orientation="vertical"
                className="h-6 mx-1"
              />
            );
          }

          if (btn.type === "dropdown" && btn.items) {
            return (
              <DropdownMenu key={index}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <btn.icon className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {btn.items.map((item) => (
                    <DropdownMenuItem
                      key={item.action}
                      onClick={() => handleAction(item.action)}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          const isActive = btn.action && activeFormats.includes(btn.action);

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="icon"
                  className={cn("h-8 w-8", isActive && "bg-accent")}
                  onClick={() => btn.action && handleAction(btn.action)}
                >
                  <btn.icon className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{btn.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
}
