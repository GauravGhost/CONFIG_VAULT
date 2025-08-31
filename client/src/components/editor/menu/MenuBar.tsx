import { Icon, type IconName } from "@/components/ui/icon"
import { Toggle } from "@/components/ui/toggle"
import type { Editor } from "@tiptap/react"
import { menuOptions } from "./menuOptions"
import { cn } from "@/lib/utils"

type MenuBarProps = {
    editor: Editor | null
    className?: string
}

const MenuBar = ({ editor, className }: MenuBarProps) => {
    if (!editor) {
        return null
    }

    const options = menuOptions(editor);
    return (
        <div className={cn("p-1 bg-background space-x-2 z-50", className)}>
            {options.map((option, index) => {
                return <Toggle key={index} onPressedChange={option.onClick} pressed={option.preesed}>
                   <Icon name={option.icon as IconName} /> 
                </Toggle>

            })}
        </div>
    )
}

export default MenuBar
