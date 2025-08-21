// Estimate token count for text (approximation)
function estimateTokens(text) {
    // Simple approximation: ~4 characters per token for English code
    // This is a rough estimate and may vary by model
    return Math.ceil(text.length / 4);
}

// Estimate tokens for multiple text segments
function estimateTotalTokens(segments) {
    return segments.reduce(
        (total, segment) => total + estimateTokens(segment),
        0
    );
}

module.exports = {
    estimateTokens,
    estimateTotalTokens,
};
