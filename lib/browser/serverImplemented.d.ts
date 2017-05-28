/// <reference types="node" />
import * as EventEmitter from "events";
export declare abstract class IPomelo extends EventEmitter {
    init: any;
    notify: any;
    request: any;
    disconnect: any;
    setReconnect: any;
    setInitCallback: (error: string) => void;
}
export interface IServer {
    host: string;
    port: number;
}
export declare class ServerParam implements IServer {
    host: string;
    port: number;
    reconnect: boolean;
}
export declare class DataDict implements Stalk.IDictionary {
    [k: string]: string;
}
export declare namespace Stalk {
    class ServerImplemented {
        private static Instance;
        static getInstance(): ServerImplemented;
        static createInstance(host: string, port: number): ServerImplemented;
        pomelo: IPomelo;
        host: string;
        port: number | string;
        authenData: Stalk.IAuthenData;
        _isConnected: boolean;
        _isLogedin: boolean;
        connect: (params: ServerParam, callback: (err: any) => void) => void;
        onSocketOpen: (data) => void;
        onSocketClose: (data) => void;
        onSocketReconnect: (data) => void;
        onDisconnected: (data) => void;
        constructor(host: string, port: number);
        getClient(): IPomelo;
        dispose(): void;
        disConnect(callBack?: Function): void;
        logout(): void;
        init(callback: (err, res) => void): void;
        private connectServer(params, callback);
        listenForPomeloEvents(): void;
        logIn(_username: string, _hash: string, deviceToken: string, callback: (err, res) => void): void;
        private authenForFrontendServer(_username, _hash, deviceToken, callback);
        gateEnter(msg: Stalk.IDictionary): Promise<IServer>;
        checkIn(msg: Stalk.IDictionary): Promise<any>;
        TokenAuthen(tokenBearer: string, checkTokenCallback: (err, res) => void): void;
        private OnTokenAuthenticate(tokenRes, onSuccessCheckToken);
        kickMeAllSession(uid: string): void;
        UpdateUserProfile(myId: string, profileFields: {
            [k: string]: string;
        }, callback: (err, res) => void): void;
        ProfileImageChanged(userId: string, path: string, callback: (err, res) => void): void;
        getMe(msg: Stalk.IDictionary, callback: (err, res) => void): void;
        updateFavoriteMember(editType: string, member: string, callback: (err, ress) => void): void;
        updateFavoriteGroups(editType: string, group: string, callback: (err, res) => void): void;
        updateClosedNoticeMemberList(editType: string, member: string, callback: (err, res) => void): void;
        updateClosedNoticeGroupsList(editType: string, group: string, callback: (err, res) => void): void;
        getMemberProfile(userId: string, callback: (err, res) => void): void;
        getCompanyInfo(callBack: (err, res) => void): void;
        getCompanyMembers(callBack: (err, res) => void): void;
        getOrganizationGroups(callBack: (err, res) => void): void;
        getProjectBaseGroups(callback: (err, res) => void): void;
        requestCreateProjectBaseGroup(groupName: string, members: any[], callback: (err, res) => void): void;
        editMemberInfoInProjectBase(roomId: string, roomType: any, member: any, callback: (err, res) => void): void;
        getPrivateGroups(callback: (err, res) => void): void;
        UserRequestCreateGroupChat(groupName: string, memberIds: string[], callback: (err, res) => void): void;
        UpdatedGroupImage(groupId: string, path: string, callback: (err, res) => void): void;
        editGroupMembers(editType: string, roomId: string, roomType: any, members: string[], callback: (err, res) => void): void;
        editGroupName(roomId: string, roomType: any, newGroupName: string, callback: (err, res) => void): void;
        getPrivateChatRoomId(token: string, myId: string, myRoommateId: string, callback: (err, res) => void): void;
        JoinChatRoomRequest(token: string, username: any, room_id: string, callback: (err, res) => void): void;
        LeaveChatRoomRequest(token: string, roomId: string, callback: (err, res) => void): void;
        videoCallRequest(targetId: string, myRtcId: string, callback: (err, res) => void): void;
        voiceCallRequest(targetId: string, myRtcId: string, callback: (err, res) => void): void;
        hangupCall(myId: string, contactId: string): void;
        theLineIsBusy(contactId: string): void;
    }
    interface IAuthenData {
        userId: string;
        token: string;
    }
    interface IDictionary {
        [k: string]: string;
    }
}