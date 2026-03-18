// ai-assistant.controller.js
// Controller for the AI Clinical Assistant panel

angular.module('bahmni.aiAssistant')
.controller('AiAssistantController', function($scope, aiAdvisorService) {
    var vm = this;
    vm.panelOpen = false;
    vm.loading = false;
    vm.aiResult = null;
    vm.error = null;

    vm.openPanel = function() {
        vm.panelOpen = true;
        vm.error = null;
        vm.aiResult = null;
    };
    vm.closePanel = function() {
        vm.panelOpen = false;
    };
    vm.analyzeCase = function() {
        vm.loading = true;
        vm.error = null;
        vm.aiResult = null;
        aiAdvisorService.analyzeCurrentConsultation()
            .then(function(result) {
                vm.aiResult = result;
            })
            .catch(function(err) {
                vm.error = err && err.message ? err.message : 'AI analysis failed.';
            })
            .finally(function() {
                vm.loading = false;
            });
    };
});
