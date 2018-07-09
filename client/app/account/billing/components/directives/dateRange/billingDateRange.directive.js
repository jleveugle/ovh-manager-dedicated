angular.module("Billing").directive("billingDateRange", [
    "BILLING_BASE_URL",
    function (BILLING_BASE_URL) {
        "use strict";
        return {
            restrict: "A",
            scope: {
                onChange: "=?"
            },
            bindToController: true,
            controllerAs: "$ctrl",
            controller: "Billing.directives.billingDateRangeCtrl",
            replace: false,
            templateUrl: `${BILLING_BASE_URL}components/directives/dateRange/billingDateRange.html`
        };
    }
]);
