import { useEditor, EditorContent } from '@tiptap/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import MenuBar from './menu/MenuBar'
import { defaultExtensions } from './extensions/defaultExtensions'
import { cn } from '@/lib/utils'
import { baseEditorClasses } from './config/editorStyles'

type TextEditorProps = {
  content: string
  onChange: (content: string) => void
  height?: number | string
  fullHeight?: boolean
  minHeight?: number | string
  hideMenuBar?: boolean
}

const TextEditor = ({
  content,
  onChange,
  height = 200,
  fullHeight = false,
  minHeight = 190,
  hideMenuBar = false,
}: TextEditorProps) => {
  const extensions = [...defaultExtensions]

  const getHeightValue = (value: number | string) => {
    return typeof value === 'number' ? `${value}px` : value
  }

  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "py-2 px-3",
          baseEditorClasses,
          fullHeight && "h-full"
        ),
        style: `min-height: ${getHeightValue(minHeight)}`
      }
    }
  })

  return (
    <div className={cn("flex flex-col", fullHeight && "h-full")}>
      {!hideMenuBar && <MenuBar editor={editor} className='border border-b-0 rounded-t-md' />}
      <ScrollArea
        className={cn(
          "border rounded-b-md bg-muted",
          fullHeight ? "h-full flex-1" : "",
          hideMenuBar ? "rounded-md" : "rounded-b-md"
        )}
        style={!fullHeight ? { height: getHeightValue(height) } : undefined}
      >
        <EditorContent editor={editor} />
      </ScrollArea>
    </div>
  )
}

export default TextEditor
