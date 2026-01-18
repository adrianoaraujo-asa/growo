// components/docs/Editor/DocumentEditor.tsx
import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";
import { cn } from "@/lib/utils";

interface DocumentEditorProps {
  initialContent?: string;
  onChange?: (content: string, text: string) => void;
  editable?: boolean;
  onUploadFile?: (file: File) => Promise<string>;
  className?: string;
  placeholder?: string;
}

export interface DocumentEditorRef {
  getContent: () => string;
  getText: () => string;
  focus: () => void;
}

// Wrapper component that lazy-loads BlockNote to avoid type checking issues
export const DocumentEditor = forwardRef<DocumentEditorRef, DocumentEditorProps>(
  ({ initialContent = "", onChange, editable = true, onUploadFile, className, placeholder }, ref) => {
    const [Editor, setEditor] = useState<any>(null);
    const [editor, setEditorInstance] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Lazy load BlockNote
    useEffect(() => {
      let mounted = true;
      
      Promise.all([
        import("@blocknote/core"),
        import("@blocknote/react"),
        import("@blocknote/mantine"),
      ]).then(([core, react, mantine]) => {
        if (mounted) {
          // Import styles
          import("@blocknote/core/fonts/inter.css");
          import("@blocknote/mantine/style.css");
          
          setEditor({
            useCreateBlockNote: react.useCreateBlockNote,
            BlockNoteView: mantine.BlockNoteView,
          });
        }
      }).catch(console.error);

      return () => { mounted = false; };
    }, []);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getContent: () => editor?.document ? JSON.stringify(editor.document) : initialContent,
      getText: () => {
        if (!editor) return "";
        try {
          const blocks = editor.document;
          return blocks.map((b: any) => {
            if (b.content && Array.isArray(b.content)) {
              return b.content.map((c: any) => c.text || "").join("");
            }
            return "";
          }).join("\n");
        } catch {
          return "";
        }
      },
      focus: () => editor?.focus(),
    }), [editor, initialContent]);

    if (!Editor) {
      return (
        <div className={cn("docs-editor p-8 min-h-[400px] flex items-center justify-center", className)}>
          <div className="text-muted-foreground">Carregando editor...</div>
        </div>
      );
    }

    return (
      <BlockNoteWrapper
        Editor={Editor}
        initialContent={initialContent}
        onChange={onChange}
        editable={editable}
        onUploadFile={onUploadFile}
        className={className}
        placeholder={placeholder}
        onEditorReady={setEditorInstance}
      />
    );
  }
);

DocumentEditor.displayName = "DocumentEditor";

// Inner component that uses BlockNote hooks
function BlockNoteWrapper({
  Editor,
  initialContent,
  onChange,
  editable,
  onUploadFile,
  className,
  placeholder,
  onEditorReady,
}: any) {
  const { useCreateBlockNote, BlockNoteView } = Editor;
  
  // Parse initial content
  const parsedContent = (() => {
    if (!initialContent) return undefined;
    try {
      if (typeof initialContent === "string" && initialContent.startsWith("[")) {
        return JSON.parse(initialContent);
      }
    } catch {}
    return undefined;
  })();

  const editor = useCreateBlockNote({
    initialContent: parsedContent,
    uploadFile: onUploadFile,
  });

  useEffect(() => {
    onEditorReady?.(editor);
  }, [editor, onEditorReady]);

  useEffect(() => {
    if (!editor || !onChange) return;

    const handleChange = () => {
      const content = JSON.stringify(editor.document);
      const text = editor.document.map((b: any) => {
        if (b.content && Array.isArray(b.content)) {
          return b.content.map((c: any) => c.text || "").join("");
        }
        return "";
      }).join("\n");
      onChange(content, text);
    };

    editor.onEditorContentChange(handleChange);
  }, [editor, onChange]);

  return (
    <div className={cn("docs-editor [&_.bn-editor]:min-h-[400px] [&_.bn-editor]:outline-none", className)}>
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme="light"
      />
    </div>
  );
}

export default DocumentEditor;
