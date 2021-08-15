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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@project/utils");
var adapter_1 = __importDefault(require("./adapter"));
// import { ParamsFromPath } from "../extract/types";
var mapValues = utils_1.fp.mapValues;
function mapRouter(routerConfig) {
    var adaptedRoute = adapter_1.default(routerConfig);
    if (!(routerConfig === null || routerConfig === void 0 ? void 0 : routerConfig.children))
        return adaptedRoute;
    // 재귀호출
    var mappingChildren = mapValues(function (router) { return mapRouter(router); }, adaptedRoute.children);
    var result = __assign(__assign({}, adaptedRoute), { children: mappingChildren });
    return result;
}
exports.default = mapRouter;
//# sourceMappingURL=index.js.map