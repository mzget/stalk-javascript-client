"use strict";
/**
 * Stalk-JavaScript, Node.js client. Supported react-native.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
 */
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCode_1 = require("../lib/utils/httpStatusCode");
const EventEmitter = require("events");
const Pomelo = require("../pomelo/reactWSClient");
class IPomelo extends EventEmitter {
}
exports.IPomelo = IPomelo;
;
class AuthenData {
}
class ServerImplemented {
    constructor(host, port) {
        this._isConnected = false;
        this._isLogedin = false;
        this.connect = this.connectServer;
        console.log("ServerImplemented", host, port);
        this.host = host;
        this.port = port;
        this.connectServer = this.connectServer.bind(this);
        this.listenForPomeloEvents = this.listenForPomeloEvents.bind(this);
    }
    static getInstance() {
        return this.Instance;
    }
    static createInstance(host, port) {
        if (this.Instance === null || this.Instance === undefined) {
            this.Instance = new ServerImplemented(host, port);
            return this.Instance;
        }
    }
    getClient() {
        let self = this;
        if (self.pomelo !== null) {
            return self.pomelo;
        }
        else {
            console.warn("disconnected.");
        }
    }
    dispose() {
        console.warn("dispose socket client.");
        this.disConnect();
        this.authenData = null;
        ServerImplemented.Instance = null;
    }
    disConnect(callBack) {
        let self = this;
        if (!!self.pomelo) {
            self.pomelo.removeAllListeners();
            self.pomelo.disconnect().then(() => {
                if (callBack)
                    callBack();
            });
        }
        else {
            if (callBack)
                callBack();
        }
    }
    logout() {
        console.log("logout request");
        let registrationId = "";
        let msg = {};
        msg["username"] = null;
        msg["registrationId"] = registrationId;
        if (this.pomelo != null)
            this.pomelo.notify("connector.entryHandler.logout", msg);
        this.disConnect();
        this.pomelo = null;
    }
    init(callback) {
        let self = this;
        this._isConnected = false;
        this.pomelo = Pomelo;
        if (!!self.pomelo) {
            // <!-- Connecting gate server.
            let params = { host: self.host, port: self.port, reconnect: false };
            self.connectServer(params, (err) => {
                callback(err, self);
            });
        }
        else {
            console.warn("pomelo socket is un ready.");
        }
    }
    connectServer(params, callback) {
        let self = this;
        this.pomelo.init(params, function cb(err) {
            console.log("socket init... ", err);
            self.pomelo.setInitCallback(null);
            callback(err);
        });
    }
    listenForPomeloEvents() {
        this.pomelo.removeAllListeners();
        this.pomelo.on("onopen", (this.onSocketOpen) ?
            this.onSocketOpen : (data) => console.log("onopen", data));
        this.pomelo.on("close", (this.onSocketClose) ?
            this.onSocketClose : (data) => {
            console.warn("close", data);
            this.pomelo.setInitCallback(null);
        });
        this.pomelo.on("reconnect", (this.onSocketReconnect) ?
            this.onSocketReconnect : (data) => console.log("reconnect", data));
        this.pomelo.on("disconnected", (data) => {
            console.warn("disconnected", data);
            this._isConnected = false;
            this.pomelo.setInitCallback(null);
            if (this.onDisconnected)
                this.onDisconnected(data);
        });
        this.pomelo.on("io-error", (data) => {
            console.warn("io-error", data);
            this.pomelo.setInitCallback(null);
        });
    }
    // region <!-- Authentication...
    /// <summary>
    /// Connect to gate server then get query of connector server.
    /// </summary>
    logIn(_username, _hash, deviceToken, callback) {
        let self = this;
        if (!!self.pomelo && this._isConnected === false) {
            let msg = { uid: _username };
            // <!-- Quering connector server.
            self.pomelo.request("gate.gateHandler.queryEntry", msg, function (result) {
                console.log("QueryConnectorServ", JSON.stringify(result));
                if (result.code === httpStatusCode_1.HttpStatusCode.success) {
                    self.disConnect();
                    let connectorPort = result.port;
                    // <!-- Connecting to connector server.
                    let params = { host: self.host, port: connectorPort, reconnect: true };
                    self.connectServer(params, (err) => {
                        self._isConnected = true;
                        if (!!err) {
                            callback(err, null);
                        }
                        else {
                            self.authenForFrontendServer(_username, _hash, deviceToken, callback);
                        }
                    });
                }
            });
        }
        else if (!!self.pomelo && this._isConnected) {
            self.authenForFrontendServer(_username, _hash, deviceToken, callback);
        }
        else {
            console.warn("pomelo client is null: connecting status %s", this._isConnected);
            console.log("Automatic init pomelo socket...");
            self.init((err, res) => {
                if (err) {
                    console.warn("Cannot starting pomelo socket!");
                    callback(err, null);
                }
                else {
                    console.log("Init socket success.");
                    self.logIn(_username, _hash, deviceToken, callback);
                }
            });
        }
    }
    // <!-- Authentication. request for token sign.
    authenForFrontendServer(_username, _hash, deviceToken, callback) {
        let self = this;
        let msg = {};
        msg["email"] = _username;
        msg["password"] = _hash;
        msg["registrationId"] = deviceToken;
        // <!-- Authentication.
        self.pomelo.request("connector.entryHandler.login", msg, function (res) {
            console.log("login response: ", JSON.stringify(res));
            if (res.code === httpStatusCode_1.HttpStatusCode.fail) {
                if (callback != null) {
                    callback(res.message, null);
                }
            }
            else if (res.code === httpStatusCode_1.HttpStatusCode.success) {
                if (callback != null) {
                    callback(null, res);
                }
            }
            else {
                if (callback !== null) {
                    callback(null, res);
                }
            }
        });
    }
    gateEnter(uid) {
        let self = this;
        let msg = { uid: uid };
        let result = new Promise((resolve, rejected) => {
            if (!!self.pomelo && this._isConnected === false) {
                // <!-- Quering connector server.
                self.pomelo.request("gate.gateHandler.queryEntry", msg, function (result) {
                    console.log("gateEnter", result);
                    if (result.code === httpStatusCode_1.HttpStatusCode.success) {
                        self.disConnect();
                        let data = { host: self.host, port: result.port };
                        resolve(data);
                    }
                    else {
                        rejected(result);
                    }
                });
            }
            else {
                let message = "pomelo client is null: connecting status is " + self._isConnected;
                console.log("Automatic init pomelo socket...");
                rejected(message);
            }
        });
        return result;
    }
    signin(msg) {
        let self = this;
        return new Promise((resolve, rejected) => {
            // <!-- Authentication.
            self.pomelo.request("connector.entryHandler.login", msg, function (res) {
                if (res.code === httpStatusCode_1.HttpStatusCode.fail) {
                    rejected(res.message);
                }
                else if (res.code === httpStatusCode_1.HttpStatusCode.success) {
                    resolve(res);
                }
                else {
                    resolve(res);
                }
            });
        });
    }
    TokenAuthen(tokenBearer, checkTokenCallback) {
        let self = this;
        let msg = {};
        msg["token"] = tokenBearer;
        self.pomelo.request("gate.gateHandler.authenGateway", msg, (result) => {
            this.OnTokenAuthenticate(result, checkTokenCallback);
        });
    }
    OnTokenAuthenticate(tokenRes, onSuccessCheckToken) {
        if (tokenRes.code === httpStatusCode_1.HttpStatusCode.success) {
            var data = tokenRes.data;
            var decode = data.decoded; //["decoded"];
            var decodedModel = JSON.parse(JSON.stringify(decode));
            if (onSuccessCheckToken != null)
                onSuccessCheckToken(null, { success: true, username: decodedModel.email, password: decodedModel.password });
        }
        else {
            if (onSuccessCheckToken != null)
                onSuccessCheckToken(tokenRes, null);
        }
    }
    kickMeAllSession(uid) {
        let self = this;
        if (self.pomelo !== null) {
            var msg = { uid: uid };
            self.pomelo.request("connector.entryHandler.kickMe", msg, function (result) {
                console.log("kickMe", JSON.stringify(result));
            });
        }
    }
    //<@--- ServerAPIProvider.
    //region <!-- user profile -->
    UpdateUserProfile(myId, profileFields, callback) {
        let self = this;
        profileFields["token"] = this.authenData.token;
        profileFields["_id"] = myId;
        self.pomelo.request("auth.profileHandler.profileUpdate", profileFields, (result) => {
            if (callback != null) {
                callback(null, result);
            }
        });
    }
    ProfileImageChanged(userId, path, callback) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        msg["userId"] = userId;
        msg["path"] = path;
        self.pomelo.request("auth.profileHandler.profileImageChanged", msg, (result) => {
            if (callback != null) {
                callback(null, result);
            }
        });
    }
    getMe(msg, callback) {
        let self = this;
        //<!-- Get user info.
        self.pomelo.request("connector.entryHandler.getMe", msg, (result) => {
            if (callback !== null) {
                callback(null, result);
            }
        });
    }
    updateFavoriteMember(editType, member, callback) {
        let self = this;
        var msg = {};
        msg["editType"] = editType;
        msg["member"] = member;
        msg["token"] = this.authenData.token;
        //<!-- Get user info.
        self.pomelo.request("auth.profileHandler.editFavoriteMembers", msg, (result) => {
            console.log("updateFavoriteMember: ", JSON.stringify(result));
            callback(null, result);
        });
    }
    updateFavoriteGroups(editType, group, callback) {
        let self = this;
        var msg = {};
        msg["editType"] = editType;
        msg["group"] = group;
        msg["token"] = this.authenData.token;
        //<!-- Get user info.
        self.pomelo.request("auth.profileHandler.updateFavoriteGroups", msg, (result) => {
            console.log("updateFavoriteGroups: ", JSON.stringify(result));
            callback(null, result);
        });
    }
    updateClosedNoticeMemberList(editType, member, callback) {
        let self = this;
        var msg = {};
        msg["editType"] = editType;
        msg["member"] = member;
        msg["token"] = this.authenData.token;
        //<!-- Get user info.
        self.pomelo.request("auth.profileHandler.updateClosedNoticeUsers", msg, (result) => {
            console.log("updateClosedNoticeUsers: ", JSON.stringify(result));
            callback(null, result);
        });
    }
    updateClosedNoticeGroupsList(editType, group, callback) {
        let self = this;
        var msg = {};
        msg["editType"] = editType;
        msg["group"] = group;
        msg["token"] = this.authenData.token;
        //<!-- Get user info.
        self.pomelo.request("auth.profileHandler.updateClosedNoticeGroups", msg, (result) => {
            console.log("updateClosedNoticeGroups: ", JSON.stringify(result));
            callback(null, result);
        });
    }
    getMemberProfile(userId, callback) {
        let self = this;
        var msg = {};
        msg["userId"] = userId;
        self.pomelo.request("auth.profileHandler.getMemberProfile", msg, (result) => {
            if (callback != null) {
                callback(null, result);
            }
        });
    }
    //endregion
    //region  Company data. 
    /// <summary>
    /// Gets the company info.
    /// Beware for data loading so mush. please load from cache before load from server.
    /// </summary>
    getCompanyInfo(callBack) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        self.pomelo.request("connector.entryHandler.getCompanyInfo", msg, (result) => {
            if (callBack != null)
                callBack(null, result);
        });
    }
    /// <summary>
    /// Gets the company members.
    /// Beware for data loading so mush. please load from cache before load from server.
    /// </summary>
    getCompanyMembers(callBack) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        self.pomelo.request("connector.entryHandler.getCompanyMember", msg, (result) => {
            console.log("getCompanyMembers", JSON.stringify(result));
            if (callBack != null)
                callBack(null, result);
        });
    }
    /// <summary>
    /// Gets the company chat rooms.
    /// Beware for data loading so mush. please load from cache before load from server.
    /// </summary>
    getOrganizationGroups(callBack) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        self.pomelo.request("connector.entryHandler.getCompanyChatRoom", msg, (result) => {
            console.log("getOrganizationGroups: " + JSON.stringify(result));
            if (callBack != null)
                callBack(null, result);
        });
    }
    //endregion
    //region Project base.
    getProjectBaseGroups(callback) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        self.pomelo.request("connector.entryHandler.getProjectBaseGroups", msg, (result) => {
            console.log("getProjectBaseGroups: " + JSON.stringify(result));
            if (callback != null)
                callback(null, result);
        });
    }
    requestCreateProjectBaseGroup(groupName, members, callback) {
        let self = this;
        let msg = {};
        msg["token"] = this.authenData.token;
        msg["groupName"] = groupName;
        msg["members"] = JSON.stringify(members);
        self.pomelo.request("chat.chatRoomHandler.requestCreateProjectBase", msg, (result) => {
            console.log("requestCreateProjectBaseGroup: " + JSON.stringify(result));
            if (callback != null)
                callback(null, result);
        });
    }
    editMemberInfoInProjectBase(roomId, roomType, member, callback) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        msg["roomId"] = roomId;
        msg["roomType"] = roomType.toString();
        msg["member"] = JSON.stringify(member);
        self.pomelo.request("chat.chatRoomHandler.editMemberInfoInProjectBase", msg, (result) => {
            if (callback != null)
                callback(null, result);
        });
    }
    //endregion
    //region <!-- Private Group Room... -->
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// <summary>
    /// Gets the public group chat rooms.
    /// Beware for data loading so mush. please load from cache before load from server.
    /// </summary>
    /// <param name="callback">Callback.</param>
    getPrivateGroups(callback) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        self.pomelo.request("connector.entryHandler.getMyPrivateGroupChat", msg, (result) => {
            console.log("getPrivateGroups: " + JSON.stringify(result));
            if (callback != null) {
                callback(null, result);
            }
        });
    }
    UserRequestCreateGroupChat(groupName, memberIds, callback) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        msg["groupName"] = groupName;
        msg["memberIds"] = JSON.stringify(memberIds);
        self.pomelo.request("chat.chatRoomHandler.userCreateGroupChat", msg, (result) => {
            console.log("RequestCreateGroupChat", JSON.stringify(result));
            if (callback != null)
                callback(null, result);
        });
    }
    UpdatedGroupImage(groupId, path, callback) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        msg["groupId"] = groupId;
        msg["path"] = path;
        self.pomelo.request("chat.chatRoomHandler.updateGroupImage", msg, (result) => {
            console.log("UpdatedGroupImage", JSON.stringify(result));
            if (callback != null) {
                callback(null, result);
            }
        });
    }
    editGroupMembers(editType, roomId, roomType, members, callback) {
        let self = this;
        if (editType == null || editType.length === 0)
            return;
        if (roomId == null || roomId.length === 0)
            return;
        if (roomType === null)
            return;
        if (members == null || members.length === 0)
            return;
        var msg = {};
        msg["token"] = this.authenData.token;
        msg["editType"] = editType;
        msg["roomId"] = roomId;
        msg["roomType"] = roomType.toString();
        msg["members"] = JSON.stringify(members);
        self.pomelo.request("chat.chatRoomHandler.editGroupMembers", msg, (result) => {
            console.log("editGroupMembers response." + result.toString());
            if (callback != null) {
                callback(null, result);
            }
        });
    }
    editGroupName(roomId, roomType, newGroupName, callback) {
        let self = this;
        if (roomId == null || roomId.length === 0)
            return;
        if (roomType === null)
            return;
        if (newGroupName == null || newGroupName.length === 0)
            return;
        var msg = {};
        msg["token"] = this.authenData.token;
        msg["roomId"] = roomId;
        msg["roomType"] = roomType.toString();
        msg["newGroupName"] = newGroupName;
        self.pomelo.request("chat.chatRoomHandler.editGroupName", msg, (result) => {
            console.log("editGroupName response." + result.toString());
            if (callback != null) {
                callback(null, result);
            }
        });
    }
    /// <summary>
    /// Gets Private Chat Room.
    /// </summary>
    /// <param name="myId">My identifier.</param>
    /// <param name="myRoommateId">My roommate identifier.</param>
    getPrivateChatRoomId(token, myId, myRoommateId, callback) {
        let self = this;
        var msg = {};
        msg["token"] = token;
        msg["ownerId"] = myId;
        msg["roommateId"] = myRoommateId;
        self.pomelo.request("chat.chatRoomHandler.getRoomById", msg, (result) => {
            if (callback != null) {
                callback(null, result);
            }
        });
    }
    // <!-- Join and leave chat room.
    JoinChatRoomRequest(token, username, room_id, callback) {
        let self = this;
        let msg = {};
        msg["token"] = token;
        msg["rid"] = room_id;
        msg["username"] = username;
        self.pomelo.request("connector.entryHandler.enterRoom", msg, (result) => {
            if (callback !== null) {
                callback(null, result);
            }
        });
    }
    LeaveChatRoomRequest(token, roomId, callback) {
        let self = this;
        let msg = {};
        msg["token"] = token;
        msg["rid"] = roomId;
        self.pomelo.request("connector.entryHandler.leaveRoom", msg, (result) => {
            if (callback != null)
                callback(null, result);
        });
    }
    //endregion
    // region <!-- Web RTC Calling...
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// <summary>
    /// Videos the call requesting.
    /// - tell target client for your call requesting...
    /// </summary>
    videoCallRequest(targetId, myRtcId, callback) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        msg["targetId"] = targetId;
        msg["myRtcId"] = myRtcId;
        self.pomelo.request("connector.entryHandler.videoCallRequest", msg, (result) => {
            console.log("videoCallRequesting =>: " + JSON.stringify(result));
            if (callback != null)
                callback(null, result);
        });
    }
    voiceCallRequest(targetId, myRtcId, callback) {
        let self = this;
        var msg = {};
        msg["token"] = this.authenData.token;
        msg["targetId"] = targetId;
        msg["myRtcId"] = myRtcId;
        self.pomelo.request("connector.entryHandler.voiceCallRequest", msg, (result) => {
            console.log("voiceCallRequesting =>: " + JSON.stringify(result));
            if (callback != null)
                callback(null, result);
        });
    }
    hangupCall(myId, contactId) {
        let self = this;
        var msg = {};
        msg["userId"] = myId;
        msg["contactId"] = contactId;
        msg["token"] = this.authenData.token;
        self.pomelo.request("connector.entryHandler.hangupCall", msg, (result) => {
            console.log("hangupCall: ", JSON.stringify(result));
        });
    }
    theLineIsBusy(contactId) {
        let self = this;
        var msg = {};
        msg["contactId"] = contactId;
        self.pomelo.request("connector.entryHandler.theLineIsBusy", msg, (result) => {
            console.log("theLineIsBusy response: " + JSON.stringify(result));
        });
    }
}
exports.ServerImplemented = ServerImplemented;
