var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
import { ServerImp } from "./ServerImplement";
// import { API } from "./API";
import { HttpStatusCode } from "../utils/httpStatusCode";
import { Authen } from "../utils/tokenDecode";
export var StalkJS;
(function (StalkJS) {
    // export type ServerImplemented = Stalk.ServerImplemented;
    // export type LobbyAPI = API.LobbyAPI;
    // export type GateAPI = API.GateAPI;
    // export type PushAPI = API.PushAPI;
    // export type ChatRoomAPI = API.ChatRoomAPI;
    // export type CallAPI = API.CallingAPI;
    var Utils;
    (function (Utils) {
        Utils.statusCode = HttpStatusCode;
        Utils.tokenDecode = Authen.TokenDecoded;
    })(Utils = StalkJS.Utils || (StalkJS.Utils = {}));
    function create(_host, _port) {
        // "ws://stalk.com"
        var server = ServerImp.createInstance(_host, _port);
        return server;
    }
    StalkJS.create = create;
    function init(server) {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promise = new Promise(function (resolve, reject) {
                            server.disConnect(function () {
                                server.init(function (err, res) {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        resolve(res);
                                    }
                                });
                            });
                        });
                        return [4 /*yield*/, promise];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    StalkJS.init = init;
    function geteEnter(server, message) {
        return __awaiter(this, void 0, void 0, function () {
            var connector;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, server.getGateAPI().gateEnter(message)];
                    case 1:
                        connector = _a.sent();
                        return [2 /*return*/, connector];
                }
            });
        });
    }
    StalkJS.geteEnter = geteEnter;
    function handshake(server, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            server.connect(params, function (err) {
                                server._isConnected = true;
                                var socket = server.getSocket();
                                if (!!socket) {
                                    server.listenSocketEvents();
                                }
                                if (!!err) {
                                    reject(err);
                                }
                                else {
                                    resolve(socket);
                                }
                            });
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    StalkJS.handshake = handshake;
    function checkIn(server, message) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, server.getLobby().checkIn(message)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    }
    StalkJS.checkIn = checkIn;
    function checkOut(server) {
        if (server) {
            var socket = server.getSocket();
            if (!!socket) {
                socket.setReconnect(false);
            }
            server.getLobby().logout();
            server.dispose();
        }
    }
    StalkJS.checkOut = checkOut;
})(StalkJS || (StalkJS = {}));
