// clinicalDataService.js
// Service to collect patient clinical context from Bahmni OpenMRS REST APIs
// Returns a structured clinical_context JSON object

const axios = require('axios');

// Configure OpenMRS API base URL and authentication as needed
const OPENMRS_BASE_URL = process.env.OPENMRS_BASE_URL || 'http://localhost:8080/openmrs/ws/rest/v1';
const OPENMRS_AUTH = process.env.OPENMRS_AUTH || '';

async function fetchFromOpenMRS(endpoint, params = {}) {
    try {
        const response = await axios.get(`${OPENMRS_BASE_URL}${endpoint}`, {
            params,
            headers: {
                'Authorization': OPENMRS_AUTH,
                'Accept': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error.message);
        return null;
    }
}

async function getClinicalContext(patientUuid) {
    // Fetch all required data in parallel
    const [demographics, encounters, obs, orders, allergies] = await Promise.all([
        fetchFromOpenMRS(`/patient/${patientUuid}`),
        fetchFromOpenMRS('/encounter', { patient: patientUuid }),
        fetchFromOpenMRS('/obs', { patient: patientUuid }),
        fetchFromOpenMRS('/order', { patient: patientUuid }),
        fetchFromOpenMRS('/allergy', { patient: patientUuid })
    ]);

    // Structure the clinical_context object
    const clinical_context = {
        demographics,
        encounters,
        observations: obs,
        orders,
        allergies
    };
    return clinical_context;
}

module.exports = {
    getClinicalContext
};
