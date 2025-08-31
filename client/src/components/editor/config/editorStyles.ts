// Centralized editor styles configuration
export const editorStyles = {
  bulletList: {
    class: "list-disc ml-8 prose-p:my-2 prose-headings:my-3 prose-li:my-0"
  },
  orderedList: {
    class: "list-decimal ml-8 prose-p:my-2 prose-headings:my-3 prose-li:my-0"
  },
  // Prose overrides for consistent rendering
  proseOverrides: {
    lists: "prose-ul:list-disc prose-ul:ml-2 prose-ol:list-decimal prose-ol:ml-2",
    spacing: "prose-p:my-2 prose-headings:my-3 prose-li:my-0",
  }
};

// Helper function to get all prose override classes
export const getProseOverrides = () => {
  return Object.values(editorStyles.proseOverrides).join(' ');
};

// Base editor classes
export const baseEditorClasses = "focus:outline-none";

// Base prose classes
export const baseProseClasses = "prose dark:prose-invert max-w-full";
