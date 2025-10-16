import { MarkdownViewer } from "./markdown-viewer";

/**
 * Example usage of the MarkdownViewer component
 * 
 * Usage:
 * ```tsx
 * <MarkdownViewer url="/docs/chapter-3-classes.md" />
 * ```
 * 
 * The component will:
 * - Fetch the markdown file from the given URL
 * - Show a loading skeleton while fetching
 * - Render the markdown with proper typography
 * - Handle errors gracefully
 */
export function MarkdownViewerExample() {
    return (
        <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "2rem" }}>
                Markdown Viewer Example
            </h1>
            
            {/* Example: Load a local markdown file */}
            <MarkdownViewer url="/docs/chapter-3-classes.md" />
            
            {/* You can also load from external URLs */}
            {/* <MarkdownViewer url="https://raw.githubusercontent.com/user/repo/main/README.md" /> */}
        </div>
    );
}
