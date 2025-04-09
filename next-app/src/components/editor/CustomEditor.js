"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

export default function CustomEditor() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start writing...</p>",
  });

  if (!isMounted) return <p>Loading editor...</p>;
  if (!editor) return <p>Initializing...</p>;

  return (
    <div className="p-4 border border-gray-300 rounded w-full max-w-2xl mx-auto mt-10">
      {/* Toolbar */}
      <div className="mb-2 flex gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 border rounded ${
            editor.isActive("bold") ? "bg-gray-800 text-white" : "bg-gray-200"
          }`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 border rounded ${
            editor.isActive("italic") ? "bg-gray-800 text-white" : "bg-gray-200"
          }`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="px-3 py-1 border rounded bg-gray-200"
        >
          Underline
        </button>
      </div>

      {/* Editor Content */}
      <div className="border p-2 min-h-[150px] rounded">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
