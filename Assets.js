const glob = require("glob");
const _ = require("lodash");

module.exports = {
    src: {
        js: [
            "client/app/app.js",
            "client/app/app.controller.js",
            "client/app/**/*.app.js",
            "client/app/**/*.module.js",
            "client/app/**/*.routes.js",
            "client/app/components/**/*.module.js",
            "client/app/components/api/*.js",
            "client/app/components/**/**.js",
            "client/app/account/**/*.js",
            "client/app/dedicated/**/*.js",
            "client/app/cdn/**/*.js",
            "client/app/dedicatedCloud/**/*.js",
            "client/app/double-authentication/**/*.js",
            "client/app/configuration/**/*.js",
            "client/app/user-contracts/**/*.js",
            "client/app/license/**/*.js",
            "client/app/download/**/*.js",
            "client/app/ip/**/*.js",
            "client/app/error/**/*.js"
        ].concat(
            _.flatten(glob.sync("./node_modules/ovh-module-*/Assets.js").map((src) => require(src).src.js))
        ),
        jsES6: [
            "dist/client/app/app.js",
            "dist/client/app/app.controller.js",
            "dist/client/app/**/*.app.js",
            "dist/client/app/**/*.module.js",
            "dist/client/app/**/*.routes.js",
            "dist/client/app/**/*.js",
            "dist/client/app/components/**/*.module.js",
            "dist/client/app/components/api/*.js",
            "dist/client/app/components/**/**.js",
            "dist/client/app/js/app/*.js",
            "dist/client/app/account/**/*.js",
            "dist/client/app/dedicated/**/*.js",
            "dist/client/app/cdn/**/*.js",
            "dist/client/app/dedicatedCloud/**/*.js",
            "dist/client/app/double-authentication/**/*.js",
            "dist/client/app/configuration/**/*.js",
            "dist/client/app/user-contracts/**/*.js",
            "dist/client/app/license/**/*.js",
            "dist/client/app/download/**/*.js",
            "dist/client/app/ip/**/*.js",
            "dist/client/app/error/**/*.js"
        ].concat(
            _.flatten(glob.sync("./node_modules/ovh-module-*/Assets.js").map((src) => require(src).src.js.map((src) => `dist/client/${src}`)))
        ),
        css: [
            "client/app/css/main.css",
            "client/app/css/main-scss.css",
            "client/app/dedicated/**/*.css",
            "client/app/dedicatedCloud/**/*.css",
            "client/app/user-contracts/**/*.css",
            "client/app/license/**/*.css",
            "client/app/ip/**/*.css",
            "client/app/css/user-account/main.css",
            "client/app/user-account/directives/checkboxSwitch/checkboxSwitch.css",
            "client/app/user-account/directives/sshkeySwitch/sshkeySwitch.css",
            "client/app/css/user-account/newAccountForm.css",
            "client/app/css/user-account/newSecuritySection.css",
            "client/app/css/billing/main.css"
        ].concat(
            _.flatten(glob.sync("./node_modules/ovh-module-*/Assets.js").map((src) => {
                return require(src).src.css;
            }))
        ),
        less: [
            "src/css/**/*.less"
        ]
    },
    server: {
        js: [
            "server/**/*.js"
        ]
    },
    EU: {
        // Note: you need to add to src.css too
        modules: [
            "ovh-module-exchange"
        ]
    },
    CA: {
        modules: [
            "ovh-module-exchange"
        ]
    },
    US: {
        modules: []
    },
    common: {
        js: [],
        css: [
            "node_modules/@bower_components/bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css",
            "node_modules/@ovh-ux/ovh-utils-angular/bin/template/contracts/contracts.css",
            "node_modules/@ovh-ux/ovh-utils-angular/bin/template/tooltipBox/*.css",
            "node_modules/@ovh-ux/ovh-utils-angular/bin/template/dateTimePicker/bootstrap-datetimepicker.min.css",
            "node_modules/@ovh-ux/ovh-utils-angular/bin/template/contracts/*.css",
            "node_modules/@ovh-ux/ovh-utils-angular/bin/template/inputNumber/*.css",
            "node_modules/@ovh-ux/ovh-utils-angular/bin/template/wizard/wizardStep/*.css",
            "node_modules/pagination-front/dist/pagination-front.min.css",
            "node_modules/font-awesome/css/font-awesome.min.css",
            "node_modules/ovh-manager-webfont/dist/css/ovh-font.css",
            "node_modules/animate.css/animate.min.css",
            "node_modules/ovh-angular-sso-auth-modal-plugin/dist/ovh-angular-sso-auth-modal-plugin.min.css",
            "node_modules/ui-select/dist/select.min.css",
            "node_modules/intl-tel-input/build/css/intlTelInput.css",
            "node_modules/ovh-angular-toaster/dist/ovh-angular-toaster.min.css"
        ]
    },
    resources: {
        i18n: [
            "client/app/**/translations/*.xml"
        ]
    }
};
