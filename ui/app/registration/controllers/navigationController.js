'use strict';

angular.module('bahmni.registration')
    .controller('NavigationController', ['$scope', '$rootScope', '$location', 'sessionService', '$window', 'appService', '$sce',
        function ($scope, $rootScope, $location, sessionService, $window, appService, $sce) {
            $scope.extensions = appService.getAppDescriptor().getExtensions("org.bahmni.registration.navigation", "link");
            var path = $location.path();
            $scope.hasPrint = !(path === "/search" || path === "/patient/new");
            $scope.goTo = function (url) {
                $location.url(url);
            };

            $scope.htmlLabel = function (label) {
                return $sce.trustAsHtml(label);
            };

            $scope.logout = function () {
                $rootScope.errorMessage = null;
                sessionService.destroy().then(
                    function () {
                        $window.location = "../home/";
                    }
                );
            };

            $scope.sync = function () {
            };

            $scope.openAIAssistant = function () {
                // Dynamically load the AI Assistant micro-frontend as a sidebar/modal
                var sidebar = document.createElement('div');
                sidebar.id = 'ai-assistant-sidebar';
                sidebar.style.position = 'fixed';
                sidebar.style.top = '0';
                sidebar.style.right = '0';
                sidebar.style.width = '420px';
                sidebar.style.height = '100%';
                sidebar.style.background = '#fff';
                sidebar.style.boxShadow = '-2px 0 8px rgba(0,0,0,0.15)';
                sidebar.style.zIndex = '9999';
                sidebar.style.overflowY = 'auto';
                sidebar.innerHTML = '<div id="ai-assistant-root"></div>';

                var closeBtn = document.createElement('button');
                closeBtn.innerText = '×';
                closeBtn.style.position = 'absolute';
                closeBtn.style.top = '10px';
                closeBtn.style.left = '10px';
                closeBtn.style.fontSize = '24px';
                closeBtn.style.background = 'transparent';
                closeBtn.style.border = 'none';
                closeBtn.style.cursor = 'pointer';
                closeBtn.onclick = function() {
                    sidebar.remove();
                };
                sidebar.appendChild(closeBtn);

                document.body.appendChild(sidebar);

                // Dynamically load the AI Assistant bundle
                var script = document.createElement('script');
                script.src = '/ui/app/micro-frontends-dist/ai-assistant.min.js';
                script.onload = function() {
                    // Render the Angular wrapper for the AIClinicalAssistant React component
                    var $injector = angular.element(document.body).injector();
                    var $compile = $injector.get('$compile');
                    var $rootScope = $injector.get('$rootScope');
                    var aiElem = $compile('<mfeAIAssistantAIClinicalAssistant></mfeAIAssistantAIClinicalAssistant>')($rootScope);
                    document.getElementById('ai-assistant-root').appendChild(aiElem[0]);
                };
                document.body.appendChild(script);
            };
        }]);
