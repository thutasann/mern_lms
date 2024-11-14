"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = exports.logger = void 0;
var pino_1 = require("pino");
var pino_http_1 = require("pino-http");
exports.logger = (0, pino_1.default)({
    level: 'info',
    base: {},
    serializers: pino_1.default.stdSerializers,
    timestamp: function () { return ",\"time\":\"".concat(new Date(Date.now()).toISOString(), "\""); },
    transport: {
        target: 'pino-pretty',
        level: 'error',
    },
});
exports.httpLogger = (0, pino_http_1.pinoHttp)({
    level: 'error',
    logger: exports.logger,
});
