import fs from "fs";
import path from "path";

const DOCS_DIR = path.resolve("docs");

const isChapterFile = (fileName: string) => /^chapter-\d+-.*\.md$/i.test(fileName);

const slugify = (value: string) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-{2,}/g, "-");

const ensureDir = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const splitChapterFile = (filePath: string) => {
    const fileName = path.basename(filePath);
    const chapterSlug = fileName.replace(/\.md$/i, "");
    const chapterDir = path.join(DOCS_DIR, chapterSlug);

    const raw = fs.readFileSync(filePath, "utf8");

    const headerMatch = raw.match(/^##\s+.*$/m);
    if (!headerMatch) {
        console.warn(`Skipping ${fileName}: no chapter header found.`);
        return;
    }

    const headerLine = headerMatch[0];
    const firstSectionIndex = raw.indexOf("### ");

    if (firstSectionIndex === -1) {
        console.warn(`Skipping ${fileName}: no section headings found.`);
        return;
    }

    const preface = raw.slice(0, firstSectionIndex).trim();
    const sectionsContent = raw.slice(firstSectionIndex);
    const sectionChunks = sectionsContent.split(/\n(?=###\s)/);

    ensureDir(chapterDir);

    const indexPath = path.join(chapterDir, "index.md");
    const indexContent = preface.length > 0 ? preface : headerLine;
    fs.writeFileSync(indexPath, `${indexContent.trim()}\n`);

    sectionChunks.forEach((chunk, chunkIndex) => {
        const sectionMatch = chunk.match(/^###\s+(.+)$/m);
        if (!sectionMatch) {
            return;
        }

        const sectionTitle = sectionMatch[1].trim();
        const sectionSlug = slugify(sectionTitle);
        const order = chunkIndex + 1;
        const sectionFileName = `${order}-${sectionSlug}.md`;
        const output = `${headerLine}\n\n${chunk.trim()}\n`;
        fs.writeFileSync(path.join(chapterDir, sectionFileName), output);
    });

    fs.unlinkSync(filePath);
};

const reorganizeDocs = () => {
    const docEntries = fs.readdirSync(DOCS_DIR);
    const chapterFiles = docEntries.filter(isChapterFile);

    chapterFiles.forEach((fileName) => {
        const filePath = path.join(DOCS_DIR, fileName);
        splitChapterFile(filePath);
    });
};

reorganizeDocs();
