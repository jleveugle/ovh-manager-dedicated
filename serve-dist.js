const express = require("express");
const request = require("request");
const base64url = require("base64url");
const cookie = require("cookie");
const proxy = require("http-proxy-middleware");
const fs = require("fs");
const app = express();

const DIST = "dist-EU";
const PORT = 8080;
const URLS = {
    login: "https://www.ovh.com/auth/requestDevLogin/",
    apiv6: "https://www.ovh.com/engine/apiv6",
    apiv7: "https://www.ovh.com/engine/apiv7",
    aapi: "https://www.ovh.com/engine/2api"
};

if (!fs.existsSync(DIST)) {
    console.error(`Cannot find ./${DIST}, did you forget to make build prod?`);
    process.exit(1);
}

// Sso authentication check
function checkAuth (req, res) {
    const headers = req.headers;
    headers.host = "www.ovh.com";
    let cookies = [];
    try {
        cookies = JSON.parse(base64url.decode(req.query.data));
        if (Array.isArray(cookies.cookies)) {
            cookies.cookies.forEach((c) => {
                const parsedCookie = cookie.parse(c);
                if (parsedCookie["CA.OVH.SES"]) {
                    res.cookie("CA.OVH.SES", parsedCookie["CA.OVH.SES"], { path: "/", httpOnly: true });
                }
                if (parsedCookie.SESSION) {
                    res.cookie("SESSION", parsedCookie.SESSION, { path: "/", httpOnly: true });
                }
                if (parsedCookie.USERID) {
                    res.cookie("USERID", parsedCookie.USERID, { path: "/" });
                }
            });
        }
    } catch (err) {
        console.error(err);
    }
    res.redirect("/");
}
app.use(/^\/auth\/check/, checkAuth);

// Sso authentication
function auth (req, res) {
    const origin = req.headers.host;
    const protocol = req.protocol || "http";
    const headers = {
        contentType: "application/json"
    };
    headers.host = "www.ovh.com";
    request.post({
        url: URLS.login,
        proxy: null,
        headers,
        followRedirect: false,
        gzip: true,
        json: {
            callbackUrl: `${protocol}://${origin}/auth/check`
        }
    }, (err, resp, data) => {
        if (err) {
            console.error(err);
            return res.status(500);
        }
        return res.redirect(data.data.url);
    });
}
app.use(/^\/auth/, auth);

// Api v6 proxy
app.use(/^\/(?:engine\/)?api(?:v6)?/, express().all("/*", proxy({
    target: URLS.apiv6,
    changeOrigin: true,
    pathRewrite: {
        "^/api/": "/",
        "^/apiv6/": "/",
        "^/engine/api/": "/",
        "^/engine/apiv6/": "/"
    },
    secure: false,
    logLevel: "debug"
})));

// Api v7 proxy
app.use(/^\/(?:engine\/)?apiv7/, express().all("/*", proxy({
    target: URLS.apiv7,
    changeOrigin: true,
    pathRewrite: {
        "^/apiv7/": "/",
        "^/engine/apiv7/": "/"
    },
    headers: {
        "X-Ovh-ApiVersion": "beta"
    },
    secure: false,
    logLevel: "debug"
})));

// 2api proxy
app.use(/^\/(?:engine\/)?2api/, express().all("/*", proxy({
    target: URLS.aapi,
    changeOrigin: true,
    pathRewrite: {
        "^/2api/": "/",
        "^/engine/2api/": "/"
    },
    headers: {
        "X-Ovh-2api-Session": ""
    },
    secure: false,
    logLevel: "debug"
})));

// Mock ngRaven in common.min.js
app.get(/common.min.js$/, (req, res) => {
    fs.readFile(`${DIST}/client/js/app/bin/common.min.js`, (err, contents) => {
        if (err) {
            console.error(`Cannot read file ${DIST}/client/js/app/bin/common.min.js`);
        }
        contents = contents + `\nangular.module("ngRaven", []);\n`;
        contents = contents + `\nangular.module("ovhNgRavenConfig", []);\n`;
        res.send(contents);
    });
});

// Serve dist-EU
app.use("/dist", express.static(`${__dirname}/${DIST}`));
app.use(express.static(`${__dirname}/${DIST}/client`));

app.listen(PORT, () => {
    console.log(`\n Now serving ${DIST} ...\n`);
});
