"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { plainTextToHtml } from "@/lib/rich-text";

const TOOLBAR_BUTTON =
  "rounded-lg px-2.5 py-1.5 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white";
const TOOLBAR_BUTTON_ACTIVE = "bg-accent/20 text-accent hover:bg-accent/20 hover:text-accent";

/**
 * Editor WYSIWYG mínimo: negrita, cursiva, dos tamaños de subtítulo y
 * listas — nada de imágenes, tablas ni links, para no complicar la
 * herramienta más de lo que el pedido original necesita. El HTML se
 * sincroniza en un <input type="hidden"> vía ref para seguir funcionando
 * con los Server Actions actuales (<form action={...}> nativo).
 */
export function RichTextEditor({ name, defaultValue = "" }: { name: string; defaultValue?: string }) {
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [3, 4] },
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        strike: false,
        link: false,
      }),
    ],
    content: plainTextToHtml(defaultValue),
    editorProps: {
      attributes: {
        class:
          "min-h-24 rounded-b-xl border border-t-0 border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-accent [&_h3]:text-xl [&_h3]:font-extrabold [&_h4]:text-lg [&_h4]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1",
      },
    },
    onUpdate: ({ editor }) => {
      if (hiddenInputRef.current) hiddenInputRef.current.value = editor.getHTML();
    },
  });

  useEffect(() => {
    if (hiddenInputRef.current) hiddenInputRef.current.value = plainTextToHtml(defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!editor) {
    return <div className="min-h-24 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white/30">Cargando editor…</div>;
  }

  return (
    <div>
      <input ref={hiddenInputRef} type="hidden" name={name} defaultValue={plainTextToHtml(defaultValue)} />
      {/* onMouseDown + preventDefault en cada botón: sin esto, el mousedown
          nativo del navegador le saca el foco/selección al editor ANTES de
          que el onClick llegue a ejecutarse, y toggleBold()/etc. terminan
          aplicándose sobre una selección vacía en vez del texto resaltado. */}
      <div className="flex flex-wrap gap-1 rounded-t-xl border border-white/10 bg-card px-2 py-1.5">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${TOOLBAR_BUTTON} ${editor.isActive("bold") ? TOOLBAR_BUTTON_ACTIVE : ""}`}
        >
          <span className="font-extrabold">B</span>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${TOOLBAR_BUTTON} ${editor.isActive("italic") ? TOOLBAR_BUTTON_ACTIVE : ""}`}
        >
          <span className="italic">I</span>
        </button>
        <div className="mx-1 w-px bg-white/10" />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${TOOLBAR_BUTTON} ${editor.isActive("heading", { level: 3 }) ? TOOLBAR_BUTTON_ACTIVE : ""}`}
        >
          Título
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={`${TOOLBAR_BUTTON} ${editor.isActive("heading", { level: 4 }) ? TOOLBAR_BUTTON_ACTIVE : ""}`}
        >
          Subtítulo
        </button>
        <div className="mx-1 w-px bg-white/10" />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${TOOLBAR_BUTTON} ${editor.isActive("bulletList") ? TOOLBAR_BUTTON_ACTIVE : ""}`}
        >
          • Lista
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${TOOLBAR_BUTTON} ${editor.isActive("orderedList") ? TOOLBAR_BUTTON_ACTIVE : ""}`}
        >
          1. Lista
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
