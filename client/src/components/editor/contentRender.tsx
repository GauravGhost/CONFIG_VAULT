import { useEffect, useState } from "react";
import { baseProseClasses, getProseOverrides } from "./config/editorStyles";
import { ScrollArea } from "../ui/scroll-area";

const ContentRenderer = ({ html }: { html?: string }) => {
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!element) {
      return;
    }
  }, [element]);

  return (
    <ScrollArea>
      <article
        ref={setElement}
        className={`tiptap ${baseProseClasses} ${getProseOverrides()}`}
        dangerouslySetInnerHTML={{ __html: html ?? "" }}
      />
    </ScrollArea>
  );
};

export { ContentRenderer };
