import React, { useCallback, useEffect, forwardRef, useImperativeHandle } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { Markdown } from "@tiptap/markdown";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Undo,
  Redo,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface TiptapEditorProps {
  content?: string;
  onChange?: (html: string, text: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
  className?: string;
}

export interface TiptapEditorRef {
  getHTML: () => string;
  getText: () => string;
  getEditor: () => Editor | null;
  getMarkdown: () => string;
}

// Detect if text contains Markdown syntax
function isMarkdownContent(text: string): boolean {
  const patterns = [
    /^#{1,6}\s+/m,           // Headers
    /\*\*[^*]+\*\*/,         // Bold with **
    /__[^_]+__/,             // Bold with __
    /^[-*+]\s+/m,            // Unordered list
    /^\d+\.\s+/m,            // Ordered list
    /^>\s+/m,                // Blockquote
    /^```/m,                 // Code block
    /\[.+?\]\(.+?\)/,        // Links
    /^-{3,}$/m,              // Horizontal rule
    /^[-*+]\s+\[[ xX]\]/m,   // Task list
  ];
  
  return patterns.some(pattern => pattern.test(text));
}

const ToolbarButton = ({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <Button
    variant="ghost"
    size="icon"
    className={cn("h-8 w-8", isActive && "bg-muted")}
    onClick={onClick}
    disabled={disabled}
    title={title}
    type="button"
  >
    {children}
  </Button>
);

const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
  (
    {
      content = "",
      onChange,
      readOnly = false,
      placeholder = "Comece a escrever...",
      onImageUpload,
      className,
    },
    ref
  ) => {
    const [isUploading, setIsUploading] = React.useState(false);
    const [linkUrl, setLinkUrl] = React.useState("");
    const [linkPopoverOpen, setLinkPopoverOpen] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
        }),
        Placeholder.configure({
          placeholder,
          emptyEditorClass: "is-editor-empty",
        }),
        Image.configure({
          inline: false,
          allowBase64: true,
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-primary underline cursor-pointer",
          },
        }),
        TaskList.configure({
          HTMLAttributes: {
            class: "not-prose",
          },
        }),
        TaskItem.configure({
          nested: true,
          HTMLAttributes: {
            class: "flex items-start gap-2",
          },
        }),
        Underline,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Highlight.configure({
          multicolor: false,
        }),
        Typography,
        Markdown,
      ],
      content,
      editable: !readOnly,
      editorProps: {
        attributes: {
          class: cn(
            "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6",
            // Custom styles for editor elements
            "[&_.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]",
            "[&_.is-editor-empty:first-child]:before:text-muted-foreground/50",
            "[&_.is-editor-empty:first-child]:before:float-left",
            "[&_.is-editor-empty:first-child]:before:h-0",
            "[&_.is-editor-empty:first-child]:before:pointer-events-none",
            // Headers - Notion-like styling
            "[&_h1]:text-3xl",
            "[&_h1]:font-bold",
            "[&_h1]:mt-8",
            "[&_h1]:mb-4",
            "[&_h1]:text-foreground",
            "[&_h1]:leading-tight",
            "[&_h2]:text-2xl",
            "[&_h2]:font-semibold",
            "[&_h2]:mt-6",
            "[&_h2]:mb-3",
            "[&_h2]:text-foreground",
            "[&_h3]:text-xl",
            "[&_h3]:font-semibold",
            "[&_h3]:mt-5",
            "[&_h3]:mb-2",
            "[&_h3]:text-foreground",
            "[&_h4]:text-lg",
            "[&_h4]:font-medium",
            "[&_h4]:mt-4",
            "[&_h4]:mb-2",
            "[&_h5]:text-base",
            "[&_h5]:font-medium",
            "[&_h5]:mt-3",
            "[&_h5]:mb-1",
            "[&_h6]:text-sm",
            "[&_h6]:font-medium",
            "[&_h6]:mt-3",
            "[&_h6]:mb-1",
            // Horizontal rule
            "[&_hr]:my-6",
            "[&_hr]:border-border",
            // Task list styling
            "[&_ul[data-type='taskList']]:list-none",
            "[&_ul[data-type='taskList']]:pl-0",
            "[&_ul[data-type='taskList']_li]:flex",
            "[&_ul[data-type='taskList']_li]:items-start",
            "[&_ul[data-type='taskList']_li]:gap-2",
            "[&_ul[data-type='taskList']_li_label]:flex",
            "[&_ul[data-type='taskList']_li_label]:items-center",
            "[&_ul[data-type='taskList']_li_input]:mt-1",
            "[&_ul[data-type='taskList']_li[data-checked='true']_div]:line-through",
            "[&_ul[data-type='taskList']_li[data-checked='true']_div]:text-muted-foreground",
            // Lists
            "[&_ul]:my-2",
            "[&_ul]:pl-6",
            "[&_ol]:my-2",
            "[&_ol]:pl-6",
            "[&_li]:my-1",
            // Code block
            "[&_pre]:bg-muted",
            "[&_pre]:rounded-lg",
            "[&_pre]:p-4",
            "[&_pre]:my-4",
            "[&_pre_code]:bg-transparent",
            "[&_code]:bg-muted",
            "[&_code]:px-1.5",
            "[&_code]:py-0.5",
            "[&_code]:rounded",
            "[&_code]:text-sm",
            "[&_code]:font-mono",
            // Blockquote
            "[&_blockquote]:border-l-4",
            "[&_blockquote]:border-primary",
            "[&_blockquote]:pl-4",
            "[&_blockquote]:italic",
            "[&_blockquote]:bg-primary/5",
            "[&_blockquote]:py-2",
            "[&_blockquote]:my-4",
            "[&_blockquote]:rounded-r",
            // Paragraphs
            "[&_p]:my-2",
            "[&_p]:leading-relaxed",
            // Images
            "[&_img]:rounded-lg",
            "[&_img]:max-w-full",
            "[&_img]:shadow-sm",
            "[&_img]:my-4"
          ),
        },
        handlePaste: (view, event) => {
          const text = event.clipboardData?.getData("text/plain");
          if (text && isMarkdownContent(text)) {
            event.preventDefault();
            // Use the Markdown extension's native parsing
            editor?.commands.insertContent(text, { contentType: 'markdown' });
            return true;
          }
          return false;
        },
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        const text = editor.getText();
        onChange?.(html, text);
      },
    });

    useImperativeHandle(ref, () => ({
      getHTML: () => editor?.getHTML() || "",
      getText: () => editor?.getText() || "",
      getEditor: () => editor,
      getMarkdown: () => editor?.getMarkdown?.() || editor?.getText() || "",
    }));

    useEffect(() => {
      if (editor && content !== editor.getHTML()) {
        editor.commands.setContent(content);
      }
    }, [content, editor]);

    const handleImageUpload = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !onImageUpload || !editor) return;

        setIsUploading(true);
        try {
          const url = await onImageUpload(file);
          editor.chain().focus().setImage({ src: url }).run();
        } catch (err) {
          console.error("Upload failed:", err);
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      },
      [editor, onImageUpload]
    );

    const addLink = useCallback(() => {
      if (!editor || !linkUrl) return;
      
      if (linkUrl === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
      } else {
        editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
      }
      setLinkUrl("");
      setLinkPopoverOpen(false);
    }, [editor, linkUrl]);

    if (!editor) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      );
    }

    return (
      <div className={cn("flex flex-col h-full border-0", className)}>
        {/* Toolbar */}
        {!readOnly && (
          <div className="flex flex-wrap items-center gap-0.5 p-2 border-b bg-muted/30 sticky top-0 z-10">
            {/* Undo/Redo */}
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Desfazer (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Refazer (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </ToolbarButton>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Block type dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1.5">
                  <Type className="w-4 h-4" />
                  <span className="text-sm hidden sm:inline">Tipo</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
                  <Type className="w-4 h-4 mr-2" /> Parágrafo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                  <Heading1 className="w-4 h-4 mr-2" /> Título 1
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                  <Heading2 className="w-4 h-4 mr-2" /> Título 2
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                  <Heading3 className="w-4 h-4 mr-2" /> Título 3
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Text formatting */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="Negrito (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="Itálico (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              title="Sublinhado (Ctrl+U)"
            >
              <UnderlineIcon className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              title="Riscado"
            >
              <Strikethrough className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive("code")}
              title="Código inline"
            >
              <Code className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              isActive={editor.isActive("highlight")}
              title="Destaque"
            >
              <Highlighter className="w-4 h-4" />
            </ToolbarButton>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Lists */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              title="Lista com marcadores"
            >
              <List className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              title="Lista numerada"
            >
              <ListOrdered className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              isActive={editor.isActive("taskList")}
              title="Lista de tarefas"
            >
              <CheckSquare className="w-4 h-4" />
            </ToolbarButton>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Block elements */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
              title="Citação"
            >
              <Quote className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive("codeBlock")}
              title="Bloco de código"
            >
              <Code className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Linha horizontal"
            >
              <Minus className="w-4 h-4" />
            </ToolbarButton>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Alignment */}
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={editor.isActive({ textAlign: "left" })}
              title="Alinhar à esquerda"
            >
              <AlignLeft className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              isActive={editor.isActive({ textAlign: "center" })}
              title="Centralizar"
            >
              <AlignCenter className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={editor.isActive({ textAlign: "right" })}
              title="Alinhar à direita"
            >
              <AlignRight className="w-4 h-4" />
            </ToolbarButton>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Link */}
            <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8", editor.isActive("link") && "bg-muted")}
                  title="Inserir link"
                  type="button"
                >
                  <LinkIcon className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://exemplo.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addLink()}
                  />
                  <Button size="sm" onClick={addLink}>
                    Inserir
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Image */}
            <ToolbarButton
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              title="Inserir imagem"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
            </ToolbarButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        )}

        {/* Editor content */}
        <div className="flex-1 overflow-y-auto">
          <EditorContent editor={editor} />
        </div>
      </div>
    );
  }
);

TiptapEditor.displayName = "TiptapEditor";

export { TiptapEditor };
