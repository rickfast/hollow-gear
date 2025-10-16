import { Card, CardBody, Skeleton } from "@heroui/react";
import React, { useEffect, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownViewerProps {
    url: string;
}

export function MarkdownViewer({ url }: MarkdownViewerProps) {
    const [content, setContent] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchMarkdown = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Failed to load markdown: ${response.statusText}`);
                }

                const text = await response.text();

                if (isMounted) {
                    setContent(text);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Failed to load markdown");
                    setLoading(false);
                }
            }
        };

        fetchMarkdown();

        return () => {
            isMounted = false;
        };
    }, [url]);

    if (loading) {
        return (
            <Card>
                <CardBody>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <Skeleton className="h-8 w-3/4 rounded-lg" />
                        <Skeleton className="h-4 w-full rounded-lg" />
                        <Skeleton className="h-4 w-full rounded-lg" />
                        <Skeleton className="h-4 w-5/6 rounded-lg" />
                        <div style={{ marginTop: "1rem" }}>
                            <Skeleton className="h-6 w-2/3 rounded-lg" />
                        </div>
                        <Skeleton className="h-4 w-full rounded-lg" />
                        <Skeleton className="h-4 w-full rounded-lg" />
                        <Skeleton className="h-4 w-4/5 rounded-lg" />
                    </div>
                </CardBody>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardBody>
                    <div
                        style={{
                            padding: "1rem",
                            backgroundColor: "var(--heroui-danger-50)",
                            borderRadius: "0.5rem",
                            color: "var(--heroui-danger)",
                        }}
                    >
                        {error}
                    </div>
                </CardBody>
            </Card>
        );
    }

    const childToString = (child?: ReactNode): string => {
        if (typeof child === "undefined" || child === null || typeof child === "boolean") {
            return "";
        }
        if (JSON.stringify(child) === "{}") {
            // Handle empty objects, e.g., from `null` or `undefined` rendered by React
            return "";
        }
        return String(child); // Convert numbers or other primitives to string
    };

    const extractTextContent = (node: React.ReactNode): string => {
        if (typeof node === "string") {
            return node;
        }
        if (typeof node === "number") {
            return String(node);
        }
        if (Array.isArray(node)) {
            return node.map(extractTextContent).join("");
        }
        if (React.isValidElement(node)) {
            const nodeProps = node.props as { children?: React.ReactNode };
            return extractTextContent(nodeProps.children);
        }
        return "";
    };

    return (
        <Card>
            <CardBody>
                <div className="markdown-content">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ children }) => (
                                <h1
                                    style={{
                                        fontSize: "2rem",
                                        fontWeight: 700,
                                        marginBottom: "1rem",
                                        marginTop: "1.5rem",
                                    }}
                                >
                                    {children}
                                </h1>
                            ),
                            h2: ({ children }) => (
                                <h2
                                    style={{
                                        fontSize: "1.5rem",
                                        fontWeight: 600,
                                        marginBottom: "0.75rem",
                                        marginTop: "1.25rem",
                                    }}
                                >
                                    {children}
                                </h2>
                            ),
                            h3: ({ children }) => (
                                <h3
                                    style={{
                                        fontSize: "1.25rem",
                                        fontWeight: 600,
                                        marginBottom: "0.5rem",
                                        marginTop: "1rem",
                                    }}
                                >
                                    {children}
                                </h3>
                            ),
                            h4: ({ children }) => (
                                <h4
                                    style={{
                                        fontSize: "1.125rem",
                                        fontWeight: 600,
                                        marginBottom: "0.5rem",
                                        marginTop: "0.75rem",
                                    }}
                                >
                                    {children}
                                </h4>
                            ),
                            h5: ({ children }) => (
                                <h5
                                    style={{
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        marginBottom: "0.5rem",
                                        marginTop: "0.5rem",
                                    }}
                                >
                                    {children}
                                </h5>
                            ),
                            h6: ({ children }) => (
                                <h6
                                    style={{
                                        fontSize: "0.875rem",
                                        fontWeight: 600,
                                        marginBottom: "0.5rem",
                                        marginTop: "0.5rem",
                                    }}
                                >
                                    {children}
                                </h6>
                            ),
                            p: ({ children }) => (
                                <p
                                    style={{
                                        marginBottom: "1rem",
                                        lineHeight: "1.6",
                                    }}
                                >
                                    {children}
                                </p>
                            ),
                            ul: ({ children }) => (
                                <ul
                                    style={{
                                        marginLeft: "1.5rem",
                                        marginBottom: "1rem",
                                        listStyleType: "disc",
                                    }}
                                >
                                    {children}
                                </ul>
                            ),
                            ol: ({ children }) => (
                                <ol
                                    style={{
                                        marginLeft: "1.5rem",
                                        marginBottom: "1rem",
                                        listStyleType: "decimal",
                                    }}
                                >
                                    {children}
                                </ol>
                            ),
                            li: ({ children }) => (
                                <li style={{ marginBottom: "0.25rem" }}>{children}</li>
                            ),
                            blockquote: ({ children }) => (
                                <blockquote
                                    style={{
                                        borderLeft: "4px solid rgba(0,0,0,0.2)",
                                        paddingLeft: "1rem",
                                        marginLeft: "0",
                                        marginBottom: "1rem",
                                        fontStyle: "italic",
                                        opacity: 0.8,
                                    }}
                                >
                                    {children}
                                </blockquote>
                            ),
                            code: ({ children, className }) => {
                                const isInline = !className;
                                return isInline ? (
                                    <code
                                        style={{
                                            backgroundColor: "rgba(0,0,0,0.05)",
                                            padding: "0.125rem 0.25rem",
                                            borderRadius: "0.25rem",
                                            fontSize: "0.875em",
                                            fontFamily: "monospace",
                                        }}
                                    >
                                        {children}
                                    </code>
                                ) : (
                                    <code
                                        style={{
                                            fontFamily: "monospace",
                                            fontSize: "0.875rem",
                                        }}
                                    >
                                        {children}
                                    </code>
                                );
                            },
                            pre: ({ children }) => (
                                <pre
                                    style={{
                                        backgroundColor: "rgba(0,0,0,0.05)",
                                        padding: "1rem",
                                        borderRadius: "0.5rem",
                                        overflow: "auto",
                                        marginBottom: "1rem",
                                    }}
                                >
                                    {children}
                                </pre>
                            ),
                            a: ({ children, href }) => (
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: "var(--heroui-primary)",
                                        textDecoration: "underline",
                                    }}
                                >
                                    {children}
                                </a>
                            ),
                            hr: () => (
                                <hr
                                    style={{
                                        margin: "1.5rem 0",
                                        border: "none",
                                        borderTop: "1px solid rgba(0,0,0,0.1)",
                                    }}
                                />
                            ),
                            strong: ({ children }) => (
                                <strong style={{ fontWeight: 600 }}>{children}</strong>
                            ),
                            em: ({ children }) => (
                                <em style={{ fontStyle: "italic" }}>{children}</em>
                            ),
                            th: ({children}) => <h2>{children}</h2>,
                            table: ({ children }) => (
                                <div
                                    style={{
                                        overflowX: "auto",
                                        marginBottom: "1rem",
                                        width: "100%",
                                    }}
                                >
                                    <table
                                        style={{
                                            minWidth: "600px",
                                            width: "100%",
                                            borderCollapse: "collapse",
                                        }}
                                    >
                                        {children}
                                    </table>
                                </div>
                            ),
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </CardBody>
        </Card>
    );
}
