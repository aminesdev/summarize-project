// AI assistants and their token limits
const AI_ASSISTANTS = [
    { id: "claude", name: "Claude AI", maxTokens: 200000 },
    { id: "gpt-4", name: "GPT-4", maxTokens: 128000 },
    { id: "chatgpt", name: "ChatGPT", maxTokens: 32000 },
    { id: "bard", name: "Bard", maxTokens: 100000 },
    { id: "none", name: "Without splitting", maxTokens: Infinity },
];

// Default output file name
const DEFAULT_OUTPUT_FILE = "project_summary.md";

module.exports = {
    AI_ASSISTANTS,
    DEFAULT_OUTPUT_FILE,
};
