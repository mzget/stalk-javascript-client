/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 *
 * Ahoo Studio.co.th
 */
export declare namespace ChatEvents {
    const ON_ADD = "onAdd";
    const ON_LEAVE: string;
    const ON_CHAT: string;
    const ON_MESSAGE_READ: string;
    const ON_GET_MESSAGES_READERS: string;
    interface IChatServerEvents {
        onChat(data: any): any;
        onMessageRead(dataEvent: any): any;
        onGetMessagesReaders(dataEvent: any): any;
        onRoomJoin(data: any): any;
        onLeaveRoom(data: any): any;
    }
}
export declare namespace StalkEvents {
    const ON_PUSH = "ON_PUSH";
    interface IPushServerListener {
        onPush(dataEvent: any): any;
    }
    interface IRTCListener {
        onVideoCall(dataEvent: any): any;
        onVoiceCall(dataEvent: any): any;
        onHangupCall(dataEvent: any): any;
        onTheLineIsBusy(dataEvent: any): any;
    }
    interface IServerListener {
        onAccessRoom(dataEvent: any): any;
        onUpdatedLastAccessTime(dataEvent: any): any;
        onAddRoomAccess(dataEvent: any): any;
        onCreateGroupSuccess(dataEvent: any): any;
        onEditedGroupMember(dataEvent: any): any;
        onEditedGroupName(dataEvent: any): any;
        onEditedGroupImage(dataEvent: any): any;
        onNewGroupCreated(dataEvent: any): any;
        onUpdateMemberInfoInProjectBase(dataEvent: any): any;
        onUserUpdateImageProfile(dataEvent: any): any;
        onUserUpdateProfile(dataEvent: any): any;
    }
}
export declare namespace ConnectorEvents {
    const ON_USER_LOGIN = "onUserLogin";
    const ON_USER_LOGOUT = "onUserLogout";
    interface BaseEvents {
        onUserLogin(dataEvent: any): any;
        onUserLogout(dataEvent: any): any;
    }
}
