const fs = require("fs").promises;
const path = require("path");
const { shouldIgnore } = require("../utils/ignorePatterns");
const { updateProgress } = require("../utils/progressBar");

class ProjectScanner {
    constructor(projectPath) {
        this.projectPath = path.resolve(projectPath);
        this.files = [];
        this.totalFiles = 0;
        this.scannedFiles = 0;
    }

    async scan() {
        this.files = [];
        this.totalFiles = 0;
        this.scannedFiles = 0;

        await this._countFiles(this.projectPath);
        await this._traverseDirectory(this.projectPath);
        return this.files;
    }

    async _traverseDirectory(currentPath) {
        try {
            const items = await fs.readdir(currentPath);

            for (const item of items) {
                const fullPath = path.join(currentPath, item);
                const stat = await fs.stat(fullPath);
                const relativePath = path.relative(this.projectPath, fullPath);

                if (shouldIgnore(relativePath, stat.isDirectory())) {
                    continue;
                }

                if (stat.isDirectory()) {
                    await this._traverseDirectory(fullPath);
                } else {
                    try {
                        const content = await fs.readFile(fullPath, "utf8");
                        this.files.push({
                            path: relativePath,
                            fullPath,
                            content,
                        });

                        this.scannedFiles++;
                        updateProgress(
                            (this.scannedFiles / this.totalFiles) * 100,
                            `Scanning ${relativePath}`
                        );
                    } catch (error) {
                        // Skip files that can't be read (binary files, etc.)
                        console.log(`Skipping binary file: ${relativePath}`);
                    }
                }
            }
        } catch (error) {
            console.log(
                `Error reading directory: ${currentPath}`,
                error.message
            );
        }
    }

    async _countFiles(currentPath) {
        try {
            const items = await fs.readdir(currentPath);

            for (const item of items) {
                const fullPath = path.join(currentPath, item);
                const stat = await fs.stat(fullPath);
                const relativePath = path.relative(this.projectPath, fullPath);

                if (shouldIgnore(relativePath, stat.isDirectory())) {
                    continue;
                }

                if (stat.isDirectory()) {
                    await this._countFiles(fullPath);
                } else {
                    this.totalFiles++;
                }
            }
        } catch (error) {
            console.log(
                `Error counting files in: ${currentPath}`,
                error.message
            );
        }
    }

    async estimateTotalFiles() {
        this.totalFiles = 0;
        await this._countFiles(this.projectPath);
        return this.totalFiles;
    }
}

module.exports = ProjectScanner;
