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

// Markdown viewer specific styles
export const markdownStyles = {
  container: "markdown-content space-y-4",
  heading: {
    h1: "text-3xl font-bold mb-4 mt-6 first:mt-0 text-foreground",
    h2: "text-2xl font-bold mb-3 mt-5 first:mt-0 text-foreground",
    h3: "text-xl font-bold mb-2 mt-4 first:mt-0 text-foreground",
    h4: "text-lg font-bold mb-2 mt-3 first:mt-0 text-foreground",
    h5: "text-base font-bold mb-1 mt-3 first:mt-0 text-foreground",
    h6: "text-sm font-bold mb-1 mt-2 first:mt-0 text-foreground",
  },
  paragraph: "mb-4 text-foreground leading-relaxed",
  list: {
    ul: "mb-4 pl-6 space-y-1 list-disc text-foreground",
    ol: "mb-4 pl-6 space-y-1 list-decimal text-foreground",
    li: "text-foreground",
  },
  code: {
    block: "mb-4 p-4 bg-muted rounded-md overflow-x-auto text-foreground",
    inline: "px-1 py-0.5 bg-muted rounded text-sm text-foreground",
  },
  blockquote: "mb-4 pl-4 border-l-4 border-border italic text-muted-foreground bg-muted/30 py-2 rounded-r",
  hr: "my-6 border-border",
  link: "text-primary hover:text-primary/80 underline",
  table: {
    wrapper: "mb-4 overflow-x-auto",
    table: "w-full border-collapse border border-border",
    th: "border border-border bg-muted px-3 py-2 text-left font-semibold text-foreground",
    td: "border border-border px-3 py-2 text-foreground",
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
