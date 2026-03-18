// aiRequestService.js
// Service to send clinical_context to external AI microservice and handle response/errors

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000/clinical-analysis';
const AUDIT_LOG_PATH = process.env.AI_AUDIT_LOG_PATH || path.join(__dirname, 'ai_audit.log');

async function analyzeClinicalContext({ doctorId, patientId, clinical_context }) {
    const timestamp = new Date().toISOString();
    let aiResponse = null;
    let error = null;
    try {
        const response = await axios.post(AI_SERVICE_URL, { clinical: clinical_context }, { timeout: 10000 });
        aiResponse = response.data;
    } catch (err) {
        error = err.message;
        aiResponse = { error: 'AI service unavailable or timed out.' };
    }
    // Audit log
    const logEntry = JSON.stringify({
        doctorId,
        patientId,
        timestamp,
        aiResponse
    }) + '\n';
    fs.appendFile(AUDIT_LOG_PATH, logEntry, err => {
        if (err) console.error('Failed to write AI audit log:', err.message);
    });
    return aiResponse;
}

module.exports = {
    analyzeClinicalContext
};
