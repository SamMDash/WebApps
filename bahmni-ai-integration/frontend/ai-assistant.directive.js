// ai-assistant.directive.js
// AngularJS directive for the AI Clinical Assistant floating button and panel

angular.module('bahmni.aiAssistant')
.directive('aiAssistant', function() {
    return {
        restrict: 'E',
        templateUrl: 'bahmni-ai-integration/ui/ai-assistant.html',
        controller: 'AiAssistantController',
        controllerAs: 'aiCtrl',
        scope: {},
        replace: true
    };
});
