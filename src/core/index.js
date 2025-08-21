const ProjectScanner = require("./ProjectScanner");
const MarkdownBuilder = require("./MarkdownBuilder");
const ProjectBuilder = require("./ProjectBuilder");
const {
    promptForProjectPath,
    promptForMarkdownPath,
    promptForOutputDirectory,
    showAIAssistantPrompt,
} = require("../cli/prompts");
const { startProgressBar, stopProgressBar } = require("../utils/progressBar");
const { showSuccess, showOutputFiles, showError } = require("../cli/display");
const fs = require("fs").promises;
const path = require("path");

async function processProjectToMarkdown() {
    try {
        const projectPath = await promptForProjectPath();
        const aiAssistant = await showAIAssistantPrompt();

        const scanner = new ProjectScanner(projectPath);

        // Count files first for accurate progress
        startProgressBar(100, 0, { status: "Counting files..." });
        await scanner.estimateTotalFiles();
        stopProgressBar();

        startProgressBar(100, 0, { status: "Scanning files..." });
        const files = await scanner.scan();
        stopProgressBar();

        if (files.length === 0) {
            showError("No files found to process");
            return;
        }

        startProgressBar(100, 0, { status: "Building Markdown..." });
        const builder = new MarkdownBuilder(aiAssistant);
        const parts = await builder.build(projectPath, files);

        const outputDir = path.dirname(projectPath);
        const projectName = path.basename(projectPath);
        const outputFiles = await builder.save(outputDir, parts, projectName);

        stopProgressBar();
        showOutputFiles(outputFiles);
    } catch (error) {
        stopProgressBar();
        showError(`Error: ${error.message}`);
    }
}

async function processMarkdownToProject() {
    try {
        const markdownPath = await promptForMarkdownPath();
        const outputPath = await promptForOutputDirectory();

        const content = await fs.readFile(markdownPath, "utf8");

        if (!content || content.trim() === "") {
            showError("Markdown file is empty");
            return;
        }

        startProgressBar(100, 0, { status: "Parsing Markdown..." });
        const builder = new ProjectBuilder();
        const fileCount = await builder.reconstructProject(content, outputPath);

        stopProgressBar();
        showSuccess(
            `Project reconstructed successfully with ${fileCount} files`
        );
    } catch (error) {
        stopProgressBar();
        showError(`Error: ${error.message}`);
    }
}

module.exports = {
    processProjectToMarkdown,
    processMarkdownToProject,
};
