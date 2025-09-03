import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import rehypeRaw from 'rehype-raw';
import { markdownComponents, markdownContainerClasses, compactMarkdownComponents } from './config/markdownComponents';

interface MarkdownViewerProps {
  content: string;
  compact?: boolean; // Option to use compact spacing
}

const MarkdownViewer = ({ content, compact = false }: MarkdownViewerProps) => {
  const [markdownContent, setMarkdownContent] = useState(content);

  // Configure DOMPurify to allow HTML tags
  const sanitizedMarkdown = DOMPurify.sanitize(markdownContent, {
    USE_PROFILES: { html: true }
  });

  useEffect(() => {
    setMarkdownContent(content);
  }, [content]);

  // Choose components based on compact prop
  const components = compact ? compactMarkdownComponents : markdownComponents;

  return (
    <div className={markdownContainerClasses}>
      <ReactMarkdown 
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {sanitizedMarkdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
