const fs = require("fs").promises;
const path = require("path");
const { estimateTokens } = require("./TokenEstimator");
const { updateProgress } = require("../utils/progressBar");
const { generateOutputFileName } = require("../utils/helpers");

class MarkdownBuilder {
    constructor(aiAssistant) {
        this.aiAssistant = aiAssistant;
        this.maxTokens = aiAssistant.maxTokens;
    }

    async build(projectPath, files) {
        const parts = [];
        const projectName = path.basename(projectPath);
        let currentPart = "";
        let currentTokens = 0;

        // Add project header to first part
        const projectHeader = `# Project: ${projectName}\n\n`;
        currentPart += projectHeader;
        currentTokens += estimateTokens(projectHeader);
        parts.push(currentPart);

        // Process each file
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const extension = path.extname(file.path).substring(1) || "text";
            const fileHeader = `## File: ${file.path}\n\`\`\`${extension}\n`;
            const fileFooter = "\n```\n\n";

            const fileContentTokens = estimateTokens(file.content);
            const headerFooterTokens = estimateTokens(fileHeader + fileFooter);
            const totalFileTokens = fileContentTokens + headerFooterTokens;

            // Update progress
            updateProgress((i / files.length) * 100, `Processing ${file.path}`);

            // Check if we need to start a new part
            if (currentTokens + totalFileTokens > this.maxTokens) {
                // Start new part
                currentPart = `# Project: ${projectName} (Part ${
                    parts.length + 1
                })\n\n`;
                currentTokens = estimateTokens(currentPart);
                parts.push(currentPart);
            }

            // Add file content to current part
            parts[parts.length - 1] += fileHeader + file.content + fileFooter;
            currentTokens += totalFileTokens;
        }

        return parts;
    }

    async save(outputDir, parts, projectName) {
        const outputFiles = [];

        for (let i = 0; i < parts.length; i++) {
            let outputPath;
            if (parts.length === 1) {
                outputPath = path.join(
                    outputDir,
                    generateOutputFileName(projectName)
                );
            } else {
                const partSuffix = `_part${i + 1}`;
                outputPath = path.join(
                    outputDir,
                    generateOutputFileName(projectName, partSuffix)
                );
            }

            await fs.writeFile(outputPath, parts[i], "utf8");
            outputFiles.push(outputPath);
        }

        return outputFiles;
    }
}

module.exports = MarkdownBuilder;
