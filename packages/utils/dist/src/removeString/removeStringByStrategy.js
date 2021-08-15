"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 전략은 주입받는 형식으로 변경
// if~else로 작성할시 새로운 전략이 추가될때마다 파일을 수정해야하는 번거로움이 있음
var removeStringByStrategy = function (strategy) { return function (target, type, findIndex) {
    // if(type === "start" ) target.slice(findIndex + 1, target.length);
    // else if(type === "base") target.slice(0, findIndex) + target.slice(findIndex + 1, target.length);
    // else target.slice(0, findIndex)
    var strategyFnc = strategy[type];
    return strategyFnc(target, findIndex);
}; };
exports.default = removeStringByStrategy;
//# sourceMappingURL=removeStringByStrategy.js.map