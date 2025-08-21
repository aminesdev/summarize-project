const { showModePrompt } = require("./cli/prompts");
const {
    processProjectToMarkdown,
    processMarkdownToProject,
} = require("./core");

// Main application function
async function main() {
    try {
        // Show mode selection prompt
        const { mode } = await showModePrompt();

        // Process based on selected mode
        if (mode === "project-to-markdown") {
            await processProjectToMarkdown();
        } else {
            await processMarkdownToProject();
        }
    } catch (error) {
        // Handle user cancellation
        if (error.message === "cancelled") {
            console.log("Operation cancelled by user");
            process.exit(0);
        }
        throw error;
    }
}

module.exports = main;
