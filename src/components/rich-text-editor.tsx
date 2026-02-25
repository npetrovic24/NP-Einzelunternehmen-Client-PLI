"use client";

import { useRef, useCallback, useEffect } from "react";
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
  const isInternalChange = useRef(false);

  // Only set innerHTML from outside when content is reset (e.g. form clear)
  useEffect(() => {
    if (!isInternalChange.current && editorRef.current) {
      if (content === "" && editorRef.current.innerHTML !== "") {
        editorRef.current.innerHTML = "";
      }
    }
    isInternalChange.current = false;
  }, [content]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
    editorRef.current?.focus();
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }, []);

  // Show/hide placeholder
  const handleFocus = useCallback(() => {
    editorRef.current?.classList.remove("is-empty");
  }, []);

  const handleBlur = useCallback(() => {
    if (editorRef.current && !editorRef.current.textContent?.trim()) {
      editorRef.current.classList.add("is-empty");
    }
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
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="prose prose-sm max-w-none px-4 py-3 focus:outline-none text-foreground is-empty
          [&.is-empty]:before:content-[attr(data-placeholder)] [&.is-empty]:before:text-muted-foreground [&.is-empty]:before:pointer-events-none"
        style={{ minHeight }}
        data-placeholder={placeholder}
      />
    </div>
  );
}
