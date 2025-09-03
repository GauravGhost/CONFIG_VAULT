import type { Components } from 'react-markdown';

/**
 * Centralized markdown components configuration for consistent rendering
 * across all markdown viewers in the application
 */
export const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mb-4 mt-6 first:mt-0 text-foreground">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold mb-3 mt-5 first:mt-0 text-foreground">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-bold mb-2 mt-4 first:mt-0 text-foreground">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-bold mb-2 mt-3 first:mt-0 text-foreground">{children}</h4>
  ),
  h5: ({ children }) => (
    <h5 className="text-base font-bold mb-1 mt-3 first:mt-0 text-foreground">{children}</h5>
  ),
  h6: ({ children }) => (
    <h6 className="text-sm font-bold mb-1 mt-2 first:mt-0 text-foreground">{children}</h6>
  ),
  
  p: ({ children }) => (
    <p className="mb-4 text-foreground leading-relaxed">{children}</p>
  ),
  
  ul: ({ children }) => (
    <ul className="mb-4 pl-6 space-y-1 list-disc text-foreground">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 pl-6 space-y-1 list-decimal text-foreground">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-foreground">{children}</li>
  ),
  
  pre: ({ children }) => (
    <pre className="mb-4 p-4 bg-muted rounded-md overflow-x-auto text-foreground">{children}</pre>
  ),
  code: ({ children, className }) => {
    const isInline = !className?.includes('language-');
    return isInline ? 
      <code className="px-1 py-0.5 bg-muted rounded text-sm text-foreground">{children}</code> :
      <code className={className}>{children}</code>;
  },
  
  blockquote: ({ children }) => (
    <blockquote className="mb-4 pl-4 border-l-4 border-border italic text-muted-foreground bg-muted/30 py-2 rounded-r">
      {children}
    </blockquote>
  ),
  
  hr: () => <hr className="my-6 border-border" />,
  
  a: ({ children, href }) => (
    <a href={href} className="text-primary hover:text-primary/80 underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  
  table: ({ children }) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse border border-border">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border bg-muted px-3 py-2 text-left font-semibold text-foreground">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-3 py-2 text-foreground">
      {children}
    </td>
  ),
};

/**
 * Base container classes for markdown content
 */
export const markdownContainerClasses = "markdown-content space-y-4";

/**
 * Alternative markdown components with different spacing (if needed)
 */
export const compactMarkdownComponents: Components = {
  ...markdownComponents,
  p: ({ children }) => (
    <p className="mb-2 text-foreground leading-relaxed">{children}</p>
  ),
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold mb-2 mt-4 first:mt-0 text-foreground">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold mb-2 mt-3 first:mt-0 text-foreground">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-bold mb-1 mt-3 first:mt-0 text-foreground">{children}</h3>
  ),
};
