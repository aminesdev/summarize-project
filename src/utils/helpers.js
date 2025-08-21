const fs = require("fs").promises;
const path = require("path");

// Validate if a path exists and is a directory
async function validateDirectoryPath(inputPath) {
    try {
        const resolvedPath = path.resolve(inputPath);
        const stats = await fs.stat(resolvedPath);

        if (!stats.isDirectory()) {
            return "Path is not a directory";
        }

        return true;
    } catch (error) {
        return "Path does not exist";
    }
}

// Validate if a path exists and is a file
async function validateFilePath(inputPath) {
    try {
        const resolvedPath = path.resolve(inputPath);
        const stats = await fs.stat(resolvedPath);

        if (!stats.isFile()) {
            return "Path is not a file";
        }

        return true;
    } catch (error) {
        return "Path does not exist";
    }
}

// Generate output file name based on project name
function generateOutputFileName(projectPath, suffix = "") {
    const projectName = path.basename(projectPath);
    const safeName = projectName.replace(/[^a-zA-Z0-9]/g, "_");
    return `${safeName}_summary${suffix}.md`;
}

module.exports = {
    validateDirectoryPath,
    validateFilePath,
    generateOutputFileName,
};
