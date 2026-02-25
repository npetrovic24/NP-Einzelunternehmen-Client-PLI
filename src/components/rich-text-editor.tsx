"use client";

import { useRef, useCallback } from "react";
import { Bold, Italic, List, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Schreibe hier...",
  minHeight = "200px",
  disabled = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    editorRef.current?.focus();
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }, []);

  return (
    <div className={cn("rounded-lg border border-input bg-background", disabled && "opacity-50 pointer-events-none")}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b px-2 py-1.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("bold")}
          title="Fett"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("italic")}
          title="Kursiv"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="mx-1 h-5 w-px bg-border" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("insertUnorderedList")}
          title="Aufzählung"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("insertOrderedList")}
          title="Nummerierte Liste"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        className="prose prose-sm max-w-none px-4 py-3 focus:outline-none text-foreground
          [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-muted-foreground"
        style={{ minHeight }}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
