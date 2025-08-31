import type { Editor } from "@tiptap/react"

export const menuOptions = (editor: Editor) => [
    {
        icon: "Heading1",
        onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        preesed: editor.isActive("heading", { level: 1 })
    },
    {
        icon: "Heading2",
        onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        preesed: editor.isActive("heading", { level: 2 })
    },
    {
        icon: "Heading3",
        onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        preesed: editor.isActive("heading", { level: 3 })
    },
    {
        icon: "Bold",
        onClick: () => editor.chain().focus().toggleBold().run(),
        preesed: editor.isActive("bold")
    },
    {
        icon: "Italic",
        onClick: () => editor.chain().focus().toggleItalic().run(),
        preesed: editor.isActive("italic")
    },
    {
        icon: "Strikethrough",
        onClick: () => editor.chain().focus().toggleStrike().run(),
        preesed: editor.isActive("strike")
    },
    {
        icon: "List",
        onClick: () => editor.chain().focus().toggleBulletList().run(),
        preesed: editor.isActive("bulletList")
    },
    {
        icon: "ListOrdered",
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
        preesed: editor.isActive("orderedList")
    },
    {
        icon: "AlignLeft",
        onClick: () => editor.chain().focus().setTextAlign('left').run(),
        preesed: editor.isActive({ textAlign: 'left' })
    },
    {
        icon: "AlignCenter",
        onClick: () => editor.chain().focus().setTextAlign('center').run(),
        preesed: editor.isActive({ textAlign: 'center' })
    },
    {
        icon: "AlignRight",
        onClick: () => editor.chain().focus().setTextAlign('right').run(),
        preesed: editor.isActive({ textAlign: 'right' })
    }
]