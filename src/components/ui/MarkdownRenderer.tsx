import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
    return (
        <div className={`prose prose-sm max-w-none ${className}`}>
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
};
