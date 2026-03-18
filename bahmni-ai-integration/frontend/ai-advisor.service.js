// ai-advisor.service.js
// AngularJS service to gather consultation data and call backend AI endpoint

angular.module('bahmni.aiAssistant')
.factory('aiAdvisorService', function($http, $q) {
    return {
        analyzeCurrentConsultation: function() {
            // Replace with actual logic to get patientId and doctorId from Bahmni context
            var patientId = window.currentPatient && window.currentPatient.uuid;
            var doctorId = window.currentUser && window.currentUser.id;
            if (!patientId || !doctorId) {
                return $q.reject({ message: 'Patient or doctor not identified.' });
            }
            return $http.post('/bahmni-ai-integration/analyze', {
                patientId: patientId,
                doctorId: doctorId
            }).then(function(response) {
                return response.data;
            }, function(error) {
                return $q.reject(error.data || { message: 'AI service error.' });
            });
        }
    };
});
