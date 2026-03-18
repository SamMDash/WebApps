// server.js
// Express backend for Bahmni AI integration
// Exposes /analyze endpoint for frontend, integrates clinicalDataService and aiRequestService

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getClinicalContext } = require('./clinicalDataService');
const { analyzeClinicalContext } = require('./aiRequestService');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Main endpoint for AI analysis
app.post('/analyze', async (req, res) => {
    const { patientId, doctorId } = req.body;
    if (!patientId || !doctorId) {
        return res.status(400).json({ error: 'Missing patientId or doctorId.' });
    }
    try {
        // Collect clinical context
        const clinical_context = await getClinicalContext(patientId);
        // Call AI microservice
        const aiResult = await analyzeClinicalContext({ doctorId, patientId, clinical_context });
        res.json(aiResult);
    } catch (error) {
        res.status(500).json({ error: error.message || 'AI analysis failed.' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Bahmni AI Integration backend running on port ${PORT}`);
});
