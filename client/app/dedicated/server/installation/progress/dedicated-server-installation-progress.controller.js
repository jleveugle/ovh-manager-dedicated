angular.module("App").controller("ServerInstallationProgressCtrl", ($scope, Server, Polling, $rootScope, $stateParams) => {
    const doingStatus = ["doing"];
    const endingStatus = ["done"];

    // waitingStatus = ["init", "todo"]
    const errorStatus = ["customer_error", "ovh_error", "error", "cancelled"];

    $scope.progress = {
        server: $scope.currentActionData,
        installationTask: null,
        installationCancel: false,
        endInstallation: false,
        installationValue: 0,
        currentStepNum: 0,
        currentStep: "",
        errorMessage: null,
        nbStep: 0,
        endStep: 0,
        errorStep: 0,
        task: null,
        ws: null,
        wsFail: null,
        disableCancel: false,
        failStatut: false
    };

    $scope.load = function () {
        Server.getTaskInProgress($stateParams.productId, "reinstallServer").then(
            (taskTab) => {
                if (taskTab.length > 0) {
                    $scope.progress.task = taskTab[0];
                    $rootScope.$broadcast("dedicated.informations.reinstall", taskTab[0]);
                }
                checkInstallationProgress();
            },
            () => {
                $scope.resetAction();
            }
        );
    };

    // Detail of install status
    function checkInstallationProgress () {
        Server.progressInstallation($stateParams.productId).then(
            (task) => {
                $scope.progress.failStatut = false;

                // doing installation or error installation
                $scope.progress.installationTask = task;
                $scope.progress.nbStep = task.progress.length;
                $scope.refreshStepProgress();
                startPollReinstall();
            },
            (err) => {
                if (err.status === 404) {
                    $scope.reduce();
                }
                $scope.progress.failStatut = true;
                startPollReinstall();
            }
        );
    }

    $scope.refreshStepProgress = function () {
        $scope.progress.currentStep = "";
        $scope.progress.errorMessage = null;
        $scope.progress.endStep = 0;
        $scope.progress.errorStep = 0;

        angular.forEach($scope.progress.installationTask.progress, (value) => {
            if (_.contains(doingStatus, value.status.toString().toLowerCase())) {
                if ($scope.progress.errorStep === 0) {
                    $scope.progress.currentStep = value.comment;
                }
                $scope.progress.endStep++;
            }
            if (_.contains(endingStatus, value.status.toString().toLowerCase())) {
                $scope.progress.endStep++;
            }
            if (_.contains(errorStatus, value.status.toString().toLowerCase())) {
                $scope.progress.disableCancel = true;
                $scope.progress.currentStep = value.comment;
                $scope.progress.errorMessage = value.error;
                $scope.progress.errorStep++;
            }
        });
        $scope.progress.currentStepNum = $scope.progress.endStep + $scope.progress.errorStep;
        $scope.progress.currentStep += ` ( ${$scope.progress.currentStepNum} / ${$scope.progress.nbStep} )`;
        $scope.progress.installationValue = ($scope.progress.endStep + $scope.progress.errorStep) * 100 / $scope.progress.nbStep;
    };

    $scope.cancelInstall = function () {
        Server.cancelTask($stateParams.productId, $scope.progress.task.id).then(
            () => {
                $scope.progress.disableCancel = true;
                $scope.progress.ws = $scope.tr("server_configuration_installation_progress_cancel_success");
            },
            (data) => {
                $scope.progress.disableCancel = true;
                $scope.progress.wsFail = $scope.tr("server_configuration_installation_progress_cancel_fail", data.data.message);
            }
        );
    };

    // task of installation
    function startPollReinstall () {
        if ($scope.progress.task) {
            // Doing installation
            Server.addTaskFast($stateParams.productId, $scope.progress.task, $scope.$id).then(
                (state) => {
                    if (Polling.isResolve(state)) {
                        $scope.progress.task = null;
                    }
                    checkInstallationProgress();
                },
                () => {
                    $scope.reduce();
                }
            );
        }
    }

    $scope.reduce = function () {
        Polling.addKilledScope($scope.$id);
        $scope.resetAction();
    };

    $scope.$on("$destroy", () => {
        Polling.addKilledScope($scope.$id);
    });
});