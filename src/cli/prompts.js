const inquirer = require("inquirer");
const { AI_ASSISTANTS } = require("../utils/constants");
const { validateDirectoryPath, validateFilePath } = require("../utils/helpers");
const fs = require("fs").promises;


if (inquirer.prompt.prompts && inquirer.prompt.prompts.list) {
    const originalGetQuestion =
        inquirer.prompt.prompts.list.prototype.getQuestion;
    inquirer.prompt.prompts.list.prototype.getQuestion = function () {
        let message = this.opt.message;

        if (message.endsWith("?")) {
            message = message.slice(0, -1);
        }
        return message;
    };
}

if (inquirer.prompt.prompts && inquirer.prompt.prompts.input) {
    inquirer.prompt.prompts.input.prototype.getQuestion = function () {
        let message = this.opt.message;
        if (message.endsWith("?")) {
            message = message.slice(0, -1);
        }
        return message;
    };
}

async function showModePrompt() {
    const { mode } = await inquirer.prompt([
        {
            type: "list",
            name: "mode",
            message: "Select mode: ",
            choices: [
                { name: "Project → Markdown", value: "project-to-markdown" },
                { name: "Markdown → Project", value: "markdown-to-project" },
            ],
        },
    ]);

    return { mode };
}

async function showAIAssistantPrompt() {
    const { assistant } = await inquirer.prompt([
        {
            type: "list",
            name: "assistant",
            message: "Choose AI assistant (for max file size): ",
            choices: AI_ASSISTANTS.map((ai) => ({
                name: `${ai.name} (${ai.maxTokens.toLocaleString()} tokens)`,
                value: ai.id,
            })),
        },
    ]);

    return AI_ASSISTANTS.find((ai) => ai.id === assistant);
}

async function promptForProjectPath() {
    const { path } = await inquirer.prompt([
        {
            type: "input",
            name: "path",
            message: "Enter project path: ",
            validate: async (input) => {
                const result = await validateDirectoryPath(input);
                return result === true
                    ? true
                    : `Error: ${result}. Please enter a valid project path`;
            },
        },
    ]);

    return path;
}

async function promptForMarkdownPath() {
    const { path } = await inquirer.prompt([
        {
            type: "input",
            name: "path",
            message: "Enter Markdown file path: ",
            validate: async (input) => {
                const result = await validateFilePath(input);
                return result === true
                    ? true
                    : `Error: ${result}. Please enter a valid Markdown file path`;
            },
        },
    ]);

    return path;
}

async function promptForOutputDirectory() {
    const { path } = await inquirer.prompt([
        {
            type: "input",
            name: "path",
            message: "Choose output folder: ",
            default: "./reconstructed-project",
            validate: async (input) => {
                try {
                    await fs.mkdir(input, { recursive: true });
                    return true;
                } catch (error) {
                    return "Error: Cannot create directory. Please enter a valid path";
                }
            },
        },
    ]);

    return path;
}

module.exports = {
    showModePrompt,
    showAIAssistantPrompt,
    promptForProjectPath,
    promptForMarkdownPath,
    promptForOutputDirectory,
};
