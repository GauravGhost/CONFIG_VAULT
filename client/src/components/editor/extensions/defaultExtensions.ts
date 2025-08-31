import StarterKit from "@tiptap/starter-kit";
import TextAlign from '@tiptap/extension-text-align'
import { editorStyles } from '../config/editorStyles'

const DefaultStarterKit = StarterKit.configure({
    bulletList: {
        HTMLAttributes: {
            class: editorStyles.bulletList.class
        }
    },
    orderedList: {
        HTMLAttributes: {
            class: editorStyles.orderedList.class
        }
    }
})

export const defaultExtensions = [
    DefaultStarterKit,
    TextAlign.configure({
        types: ['heading', 'paragraph']
    })
]
