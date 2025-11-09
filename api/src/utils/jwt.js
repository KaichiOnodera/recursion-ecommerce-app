"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
exports.__esModule = true;
exports.verifyJWT = exports.generateJWT = exports.TOKEN_VERSION = void 0;
var jose_1 = require("jose");
exports.TOKEN_VERSION = '1.0';
var JWT_SECRET = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : 'invalid';
var ISSUER = 'recursion-ecommerce-app';
var AUDIENCE = 'api';
// JWTトークンの生成
var generateJWT = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var secret, alg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                secret = new TextEncoder().encode(JWT_SECRET);
                alg = 'HS256';
                return [4 /*yield*/, new jose_1.SignJWT(__assign(__assign({}, payload), { version: exports.TOKEN_VERSION }))
                        .setProtectedHeader({ alg: alg })
                        .setIssuedAt()
                        .setIssuer(ISSUER)
                        .setAudience(AUDIENCE)
                        .setExpirationTime('24h')
                        .sign(secret)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.generateJWT = generateJWT;
// JWTトークンの検証
var verifyJWT = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var secret, payload;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                secret = new TextEncoder().encode(JWT_SECRET);
                return [4 /*yield*/, (0, jose_1.jwtVerify)(token, secret, {
                        issuer: ISSUER,
                        audience: AUDIENCE
                    })];
            case 1:
                payload = (_a.sent()).payload;
                if (typeof payload.userId !== 'number' ||
                    typeof payload.email !== 'string' ||
                    (payload.role !== 'USER' && payload.role !== 'ADMIN') ||
                    typeof payload.version !== 'string') {
                    throw new Error('Invalid token payload');
                }
                return [2 /*return*/, {
                        userId: payload.userId,
                        email: payload.email,
                        role: payload.role,
                        version: payload.version
                    }];
        }
    });
}); };
exports.verifyJWT = verifyJWT;
