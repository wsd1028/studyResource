import { Config } from "./config";
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.getImageFullUrl = function (url) {
        return "" + Config.baseUrl + url + "?r=" + Math.random();
    };
    return Util;
}());
export { Util };
//# sourceMappingURL=util.js.map