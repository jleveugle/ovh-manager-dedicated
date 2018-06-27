angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.configuration", {
        url: "/configuration",
        template: require("configuration/configuration.html"),
        controller: "ConfigurationCtrl",
        controllerAs: "$ctrl",
        translations: ["common"]
    });
});
