#!/usr/bin/env node

// Main entry point for the CLI tool
const main = require("../src/main");

// Execute main function and handle errors
main().catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
});
