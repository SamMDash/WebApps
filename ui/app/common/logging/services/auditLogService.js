'use strict';
angular.module('bahmni.common.logging')
    .service('auditLogService', ['$http', '$translate', 'configurationService', function ($http, $translate, configurationService) {
        var DateUtil = Bahmni.Common.Util.DateUtil;

        var convertToLocalDate = function (date) {
            var timestamp = _.isNumber(date) ? date : Number(date);
            var localDate = !isNaN(timestamp) ? DateUtil.parseLongDateToServerFormat(timestamp) : date;
            var formattedDate = DateUtil.getDateTimeInSpecifiedFormat(localDate, 'MMMM Do, YYYY [at] h:mm:ss A');
            return DateUtil.isInvalid(formattedDate) ? DateUtil.getDateTimeInSpecifiedFormat(timestamp, 'MMMM Do, YYYY [at] h:mm:ss A') : formattedDate;
        };

        var splitMessageAndParams = function (message) {
            var rawMessage = _.isString(message) ? message : '';
            var splitMessage = rawMessage.split('~');
            var params;

            if (splitMessage[1]) {
                try {
                    params = JSON.parse(splitMessage[1]);
                } catch (e) {
                    params = undefined;
                }
            }

            return {
                message: splitMessage[0],
                params: params
            };
        };

        this.getLogs = function (params) {
            params = params || {};
            return $http.get(Bahmni.Common.Constants.auditLogUrl, {params: params}).then(function (response) {
                return response.data.map(function (log) {
                    var messageAndParams = splitMessageAndParams(log.message);
                    log.dateCreated = convertToLocalDate(log.dateCreated);
                    log.params = messageAndParams.params;
                    log.message = messageAndParams.message;
                    log.displayMessage = $translate.instant(log.message, log);
                    return log;
                });
            });
        };

        this.log = function (patientUuid, eventType, messageParams, module) {
            return configurationService.getConfigurations(['enableAuditLog']).then(function (result) {
                if (result.enableAuditLog) {
                    var params = {};
                    params.patientUuid = patientUuid;
                    params.eventType = Bahmni.Common.AuditLogEventDetails[eventType].eventType;
                    params.message = Bahmni.Common.AuditLogEventDetails[eventType].message;
                    params.message = messageParams ? params.message + '~' + JSON.stringify(messageParams) : params.message;
                    params.module = module;
                    return $http.post(Bahmni.Common.Constants.auditLogUrl, params, {withCredentials: true});
                }
            });
        };
    }]);
