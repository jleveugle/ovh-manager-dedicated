angular.module("App").controller("ServerCancelBandwidthCtrl", ($rootScope, $scope, $stateParams, Server, User, Alerter) => {
    "use strict";

    $scope.loader = {
        loading: true
    };

    $scope.cancelOption = function () {
        $scope.loader.loading = true;

        Server.cancelBandwidthOption($stateParams.productId)
            .then(() => {
                $scope.setMessage($scope.tr("server_cancel_bandwidth_cancel_success"), true);
                $rootScope.$broadcast("dedicated.informations.bandwidth");
            })
            .catch((data) => {
                $scope.setMessage($scope.tr("server_cancel_bandwidth_cancel_error"), data);
            })
            .finally(() => {
                $scope.resetAction();
                $scope.loader.loading = false;
            });
    };

    function init () {
        $scope.loader.loading = true;
        User.getUser()
            .then((user) => {
                $scope.user = user;
            })
            .catch(() => {
                Alerter.alertFromSWS($scope.tr("server_cancel_bandwidth_confirmation_error"), { type: "WARNING" }, "cancelBandwidthConfirmationError");
            })
            .finally(() => {
                $scope.loader.loading = false;
            });
    }

    init();
});