var Config = /** @class */ (function () {
    function Config() {
    }
    Object.defineProperty(Config, "baseUrl", {
        get: function () {
            return Config._baseUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "isDebug", {
        get: function () {
            return Config._isDebug;
        },
        enumerable: true,
        configurable: true
    });
    /***生产环境****/
    // private static _isDebug="false";
    Config._baseUrl = "/Resource/Room2D";
    /***测试环境****/
    Config._isDebug = "false";
    return Config;
}());
export { Config };
//# sourceMappingURL=config.js.map