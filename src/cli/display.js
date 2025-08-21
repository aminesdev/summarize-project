// Display success message
function showSuccess(message) {
    console.log(`✓ ${message}`);
}

// Display error message
function showError(message) {
    console.log(`✗ ${message}`);
}

// Display information message
function showInfo(message) {
    console.log(`→ ${message}`);
}

// Display output files list
function showOutputFiles(files) {
    if (files.length === 1) {
        showSuccess(`Output: ${files[0]}`);
    } else {
        showSuccess(`Output: ${files.length} files created`);
        files.forEach((file) => {
            console.log(`  ${file}`);
        });
    }
}

module.exports = {
    showSuccess,
    showError,
    showInfo,
    showOutputFiles,
};
