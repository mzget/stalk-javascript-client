/**
 *  NotificationManager
 *
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */
import BackendFactory from "./BackendFactory";
import { ContentType } from "./models/ChatDataModels";
import PushNotifyHelper from '../libs/pushNotifyHelper';
import Store from "../reducers/configureStore";
export default class NotificationManager {
    static getInstance() {
        if (!NotificationManager.instance) {
            NotificationManager.instance = new NotificationManager();
        }
        return NotificationManager.instance;
    }
    init(onSuccess) {
        console.log("Initialize NotificationManager.");
        PushNotifyHelper.getInstance().configure(onSuccess);
    }
    regisNotifyNewMessageEvent() {
        console.log("subscribe global notify message event");
        BackendFactory.getInstance().dataListener.addNoticeNewMessageEvent(this.notify);
    }
    unsubscribeGlobalNotifyMessageEvent() {
        BackendFactory.getInstance().dataListener.removeNoticeNewMessageEvent(this.notify);
    }
    notify(messageImp) {
        //@ Check app not run in background.
        let device = Store.getState().deviceReducer; //active, background, inactive
        console.log("Notify Message. AppState is ", device.appState);
        let message = messageImp.body;
        if (messageImp.type == ContentType[ContentType.Location]) {
            message = "Sent you location";
        }
        else if (messageImp.type == ContentType[ContentType.Image]) {
            message = "Sent you image";
        }
        if (device.appState == "active") {
            PushNotifyHelper.getInstance().localNotification(message);
        }
        else if (device.appState != "active") {
            //@ When user joined room but appState is inActive.
            // sharedObjectService.getNotifyManager().notify(newMsg, appBackground, localNotifyService);
            PushNotifyHelper.getInstance().localNotification(message);
        }
    }
}
