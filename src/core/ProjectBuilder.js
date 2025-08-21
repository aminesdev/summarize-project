const fs = require("fs").promises;
const path = require("path");
const { updateProgress } = require("../utils/progressBar");

class ProjectBuilder {
    constructor() {}

    // Parse Markdown and extract file information
    parseMarkdownContent(content) {
        const files = [];
        const lines = content.split("\n");
        let currentFile = null;
        let inCodeBlock = false;
        let currentLanguage = "";
        let skipNextLine = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            // Skip empty lines
            if (trimmedLine === "" && !inCodeBlock) {
                continue;
            }

            // Check for file header
            const fileHeaderMatch = trimmedLine.match(/^## File: (.*)$/);
            if (fileHeaderMatch && !inCodeBlock) {
                if (currentFile) {
                    // Remove the last newline from the previous file content
                    currentFile.content = currentFile.content.replace(
                        /\n$/,
                        ""
                    );
                    files.push(currentFile);
                }
                currentFile = {
                    path: fileHeaderMatch[1],
                    content: "",
                };
                continue;
            }

            // Check for code block start
            const codeBlockMatch = trimmedLine.match(/^```(\w*)$/);
            if (codeBlockMatch && currentFile && !inCodeBlock) {
                inCodeBlock = true;
                currentLanguage = codeBlockMatch[1];
                continue;
            }

            // Check for code block end
            if (trimmedLine === "```" && inCodeBlock) {
                inCodeBlock = false;
                continue;
            }

            // Add content to current file
            if (inCodeBlock && currentFile) {
                currentFile.content += line + "\n";
            }
        }

        // Add the last file
        if (currentFile) {
            // Remove the last newline from the content
            currentFile.content = currentFile.content.replace(/\n$/, "");
            files.push(currentFile);
        }

        return files;
    }

    // Reconstruct project from Markdown content
    async reconstructProject(markdownContent, outputPath) {
        const files = this.parseMarkdownContent(markdownContent);

        if (files.length === 0) {
            throw new Error("No files found in the Markdown content");
        }

        // Create output directory
        await fs.mkdir(outputPath, { recursive: true });

        // Recreate each file
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const filePath = path.join(outputPath, file.path);
            const dirPath = path.dirname(filePath);

            // Create directory if it doesn't exist
            await fs.mkdir(dirPath, { recursive: true });

            // Write file content
            await fs.writeFile(filePath, file.content, "utf8");

            // Update progress
            updateProgress((i / files.length) * 100, `Creating ${file.path}`);
        }

        return files.length;
    }
}

module.exports = ProjectBuilder;
