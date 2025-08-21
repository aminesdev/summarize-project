const path = require("path");

const NO_EXT_WHITELIST = ["LICENSE", "Makefile", "Dockerfile", "README"];

// Patterns to ignore when scanning projects
const IGNORE_PATTERNS = [
    // Node.js
    "node_modules",
    "dist",
    "build",
    ".next",
    ".npm",
    ".yarn",
    // Python
    "__pycache__",
    ".venv",
    "venv",
    ".mypy_cache",
    ".pytest_cache",
    // Java
    "target",
    "bin",
    ".gradle",
    "build",
    // Go
    "vendor",
    "bin",
    "pkg",
    // PHP
    "vendor",
    // Version control
    ".git",
    ".svn",
    ".hg",
    // OS files
    ".DS_Store",
    "Thumbs.db",
    "desktop.ini",
    // IDE files
    ".idea",
    ".vscode",
    ".vs",
    // Logs and temp files
    "logs",
    "tmp",
    "temp",
    "*.log",
    // Media files
    "*.mp3",
    "*.wav",
    "*.flac",
    "*.aac",
    "*.ogg",
    "*.m4a",
    "*.wma",
    "*.mp4",
    "*.avi",
    "*.mov",
    "*.wmv",
    "*.flv",
    "*.mkv",
    "*.webm",
    "*.jpg",
    "*.jpeg",
    "*.png",
    "*.gif",
    "*.bmp",
    "*.tiff",
    "*.svg",
    "*.webp",
    // Archive files
    "*.zip",
    "*.rar",
    "*.tar",
    "*.gz",
    "*.7z",
    "*.iso",
    // Documents
    "*.pdf",
    "*.doc",
    "*.docx",
    "*.xls",
    "*.xlsx",
    "*.ppt",
    "*.pptx",
    // Executables and binaries
    "*.exe",
    "*.dll",
    "*.so",
    "*.dylib",
    "*.bin",
    // Database and large data files
    "*.db",
    "*.sqlite",
    "*.mdb",
    "*.accdb",
    "*.sql",
    // Other non-code files
    "*.ico",
    "*.icns",
    "*.ttf",
    "*.otf",
    "*.woff",
    "*.woff2",
    "*.eot",
];

// Check if a path should be ignored
function shouldIgnore(filePath, isDirectory) {
    const normalizedPath = filePath.replace(/\\/g, "/");
    const base = path.basename(normalizedPath);

    // 1. If directory matches ignore list
    if (isDirectory && IGNORE_PATTERNS.includes(base)) {
        return true;
    }

    // 2. Check all patterns
    for (const pattern of IGNORE_PATTERNS) {
        if (pattern.includes("*")) {
            // Handle wildcard patterns with regex
            const regexPattern = pattern
                .replace(/\*/g, ".*") // Replace * with .*
                .replace(/\./g, "\\."); // Escape dots

            const regex = new RegExp(`^${regexPattern}$`);
            if (regex.test(base)) {
                return true;
            }
        } else if (!isDirectory && base === pattern) {
            // Exact match for files
            return true;
        } else if (normalizedPath.startsWith(pattern + "/")) {
            // Check if path starts with pattern (for directories)
            return true;
        }
    }

    // 3. Ignore files with no extension unless whitelisted
    if (
        !isDirectory &&
        !path.extname(base) &&
        !NO_EXT_WHITELIST.includes(base)
    ) {
        return true;
    }

    return false;
}

module.exports = {
    shouldIgnore,
    IGNORE_PATTERNS,
};
