import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import rehypeRaw from 'rehype-raw';

interface MarkdownViewerProps {
  content: string;
}

const MarkdownViewer = ({ content }: MarkdownViewerProps) => {

  const [markdownContent, setMarkdownContent] = useState(content);

  // Configure DOMPurify to allow HTML tags
  const sanitizedMarkdown = DOMPurify.sanitize(markdownContent, {
    USE_PROFILES: { html: true }
  });

  useEffect(() => {
    setMarkdownContent(content);
  }, [content]);

  return (
      <div className="markdown-content">
        <ReactMarkdown rehypePlugins={[rehypeRaw]} >
          {sanitizedMarkdown}
        </ReactMarkdown>
      </div>
  );
};

export default MarkdownViewer;
