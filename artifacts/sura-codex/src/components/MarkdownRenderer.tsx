import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-lg prose-stone dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-normal prose-p:leading-[1.8] prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}