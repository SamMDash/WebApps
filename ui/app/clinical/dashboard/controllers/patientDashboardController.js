'use strict';

angular.module('bahmni.clinical')
    .controller('PatientDashboardController', ['$scope', 'clinicalAppConfigService', 'clinicalDashboardConfig', 'printer',
        '$state', 'spinner', 'visitSummary', 'appService', '$stateParams', 'diseaseTemplateService', 'patientContext', '$location', '$filter', 'ngDialog',
        function ($scope, clinicalAppConfigService, clinicalDashboardConfig, printer,
            $state, spinner, visitSummary, appService, $stateParams, diseaseTemplateService, patientContext, $location, $filter, ngDialog) {
            // AI Assistant Button Handler
            $scope.openAIAssistant = function () {
                console.log('[AI Assistant] Button clicked');
                var patientUuid = $stateParams.patientUuid;
                var doctorUuid = '';
                if (window.sessionContext && window.sessionContext.currentProvider && window.sessionContext.currentProvider.uuid) {
                    doctorUuid = window.sessionContext.currentProvider.uuid;
                } else if (window.currentUser && window.currentUser.uuid) {
                    doctorUuid = window.currentUser.uuid;
                }
                // ai-integration-frontend runs on port 8082
                var aiUrl = window.location.protocol + '//' + window.location.hostname + ':8082';
                var url = aiUrl + '/?patientUuid=' + encodeURIComponent(patientUuid);
                if (doctorUuid) {
                    url += '&doctorUuid=' + encodeURIComponent(doctorUuid);
                }
                console.log('[AI Assistant] Opening modal with URL:', url);
                ngDialog.open({
                    template: '<div style="padding:0"><iframe src="' + url + '" style="width:100%;height:75vh;border:none;display:block"></iframe></div>',
                    plain: true,
                    className: 'ngdialog-theme-default ai-assistant-modal',
                    width: '80%'
                });
            };
            $scope.patient = patientContext.patient;
            $scope.activeVisit = $scope.visitHistory.activeVisit;
            $scope.activeVisitData = {};
            $scope.obsIgnoreList = clinicalAppConfigService.getObsIgnoreList();
            $scope.clinicalDashboardConfig = clinicalDashboardConfig;
            $scope.visitSummary = visitSummary;
            $scope.enrollment = $stateParams.enrollment;
            $scope.isDashboardPrinting = false;
            var programConfig = appService.getAppDescriptor().getConfigValue("program") || {};
            $state.discardChanges = false;

            $scope.ipdDashboard = {
                hostData: {
                    patientId: $stateParams.patientUuid,
                    forDate: new Date().toUTCString()
                }
            };

            $scope.alergyData = {
                name: 'Customised for me!!!'
            };

            $scope.alergyApi = {
                callback: function () {
                    alert("We have a full fledged problem");
                }
            };

            $scope.stateChange = function () {
                return $state.current.name === 'patient.dashboard.show';
            };

            var cleanUpListenerSwitchDashboard = $scope.$on("event:switchDashboard", function (event, dashboard) {
                $scope.init(dashboard);
            });

            var cleanUpListenerPrintDashboard = $scope.$on("event:printDashboard", function (event, tab) {
                var printScope = $scope.$new();
                printScope.isDashboardPrinting = true;
                printScope.tabBeingPrinted = tab || clinicalDashboardConfig.currentTab;
                var dashboardModel = Bahmni.Common.DisplayControl.Dashboard.create(printScope.tabBeingPrinted, $filter);
                spinner.forPromise(diseaseTemplateService.getLatestDiseaseTemplates(
                    $stateParams.patientUuid,
                    clinicalDashboardConfig.getDiseaseTemplateSections(printScope.tabBeingPrinted),
                    null,
                    null
                ).then(function (diseaseTemplate) {
                    printScope.diseaseTemplates = diseaseTemplate;
                    printScope.sectionGroups = dashboardModel.getSections(printScope.diseaseTemplates);
                    printer.printFromScope('dashboard/views/dashboardPrint.html', printScope);
                }));
            });

            $scope.$on("$destroy", function () {
                cleanUpListenerSwitchDashboard();
                cleanUpListenerPrintDashboard();
            });

            var addTabNameToParams = function (board) {
                $location.search('currentTab', board.translationKey).replace();
            };

            var getCurrentTab = function () {
                var currentTabKey = $location.search().currentTab;
                var currentTab = $state.current.dashboard;
                if (currentTabKey) {
                    currentTab = _.find(clinicalDashboardConfig.visibleTabs, function (tab) {
                        return tab.translationKey === currentTabKey;
                    });
                }
                return (currentTab != undefined ? currentTab : clinicalDashboardConfig.currentTab);
            };

            $scope.init = function (dashboard) {
                dashboard.startDate = null;
                dashboard.endDate = null;
                if (programConfig.showDetailsWithinDateRange) {
                    dashboard.startDate = $stateParams.dateEnrolled;
                    dashboard.endDate = $stateParams.dateCompleted;
                }
                $state.current.dashboard = dashboard;
                clinicalDashboardConfig.switchTab(dashboard);
                addTabNameToParams(dashboard);
                var dashboardModel = Bahmni.Common.DisplayControl.Dashboard.create(dashboard, $filter);
                diseaseTemplateService.getLatestDiseaseTemplates(
                    $stateParams.patientUuid, clinicalDashboardConfig.getDiseaseTemplateSections(), dashboard.startDate, dashboard.endDate).then(function (diseaseTemplate) {
                        $scope.diseaseTemplates = diseaseTemplate;
                        $scope.sectionGroups = dashboardModel.getSections($scope.diseaseTemplates);
                    });
                $scope.currentDashboardTemplateUrl = $state.current.views['dashboard-content'] ?
                    $state.current.views['dashboard-content'].templateUrl : $state.current.views['dashboard-content'];
            };

            $scope.init(getCurrentTab());
        }]);
