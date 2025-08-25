'use client';

import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import 'highlight.js/styles/github-dark.css';
import styles from './ReadmeViewer.module.css';

// Mermaid component for client-side rendering
const MermaidDiagram: React.FC<{ chart: string }> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderMermaid = async () => {
      if (ref.current) {
        try {
          const mermaid = (await import('mermaid')).default;
          mermaid.initialize({ 
            startOnLoad: true, 
            theme: 'dark',
            securityLevel: 'loose'
          });
          
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          const { svg } = await mermaid.render(id, chart);
          ref.current.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          ref.current.innerHTML = `<pre><code class="language-mermaid">${chart}</code></pre>`;
        }
      }
    };

    renderMermaid();
  }, [chart]);

  return <div ref={ref} className={styles.mermaidDiagram} />;
};

interface ReadmeViewerProps {
  content: string;
  repoName: string;
}

const ReadmeViewer: React.FC<ReadmeViewerProps> = ({ content, repoName }) => {
  return (
    <div className={styles.readmeViewer}>
      <div className={styles.header}>
        <svg className={styles.icon} width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 14v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"/>
        </svg>
        <span className={styles.title}>README.md</span>
      </div>
      <div className={styles.content}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeSanitize]}
          components={{
            // Handle code blocks with Mermaid support
            code: ({ node, inline, className, children, ...props }: any) => {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              
              if (!inline && language === 'mermaid') {
                return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
              }
              
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            // Handle div elements
            div: ({ children, ...props }: any) => {
              const { align, ...restProps } = props;
              return (
                <div 
                  {...restProps} 
                  style={{ 
                    textAlign: align,
                    ...props.style 
                  }}
                >
                  {children}
                </div>
              );
            },
            // Handle img elements
            img: ({ src, alt, width, height, ...props }: any) => (
              <img 
                src={src} 
                alt={alt}
                style={{
                  width: width ? `${width}px` : undefined,
                  maxWidth: '100%',
                  height: 'auto'
                }}
                {...props}
              />
            ),
            // Handle table elements
            table: ({ children, ...props }: any) => (
              <table {...props} style={{ width: '100%', borderCollapse: 'collapse' }}>
                {children}
              </table>
            ),
            // Handle td/th elements  
            td: ({ children, ...props }: any) => {
              const { align, vAlign, ...restProps } = props;
              return (
                <td 
                  {...restProps}
                  style={{
                    textAlign: align,
                    verticalAlign: vAlign,
                    padding: '8px',
                    border: '1px solid var(--gray-700)'
                  }}
                >
                  {children}
                </td>
              );
            },
            th: ({ children, ...props }: any) => {
              const { align, vAlign, ...restProps } = props;
              return (
                <th 
                  {...restProps}
                  style={{
                    textAlign: align,
                    verticalAlign: vAlign,
                    padding: '8px',
                    border: '1px solid var(--gray-700)',
                    backgroundColor: 'var(--gray-800)'
                  }}
                >
                  {children}
                </th>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ReadmeViewer;
