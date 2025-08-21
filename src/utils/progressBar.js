const cliProgress = require("cli-progress");

// Create a new progress bar instance with better formatting
const progressBar = new cliProgress.SingleBar({
    format: "[{bar}] {percentage}% | {status}",
    barCompleteChar: "#",
    barIncompleteChar: "-",
    hideCursor: true,
    clearOnComplete: true,
});

function updateProgress(percentage, status) {
    progressBar.update(percentage, { status });

    if (percentage >= 100) {
        progressBar.stop();
    }
}

function startProgressBar(total, startValue, options) {
    progressBar.start(total, startValue, options);
}

function stopProgressBar() {
    progressBar.stop();
}

module.exports = {
    updateProgress,
    startProgressBar,
    stopProgressBar,
};
