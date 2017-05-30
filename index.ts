/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by@ nattapon.r@live.com
 * 
 * Ahoo Studio.co.th 
 */

export { Stalk, IPomelo, IServer, IDictionary } from "./lib/browser/serverImplemented";
export * from "./lib/browser/StalkEvents";

import { HttpStatusCode } from "./lib/utils/httpStatusCode";
import { Authen } from "./lib/utils/tokenDecode";
import { Stalk, IPomelo, IServer, IDictionary } from "./lib/browser/serverImplemented";
import { API } from "./lib/browser/API";

export type ServerImplemented = Stalk.ServerImplemented;
export type LobbyAPI = API.LobbyAPI;

export namespace Utils {
    export var statusCode = HttpStatusCode;
    export var tokenDecode = Authen.TokenDecoded;
}

export namespace StalkFactory {
    export function create(_host: string, _port: number) {
        let server = Stalk.ServerImplemented.createInstance(_host, _port);
        return server;
    }

    export async function init(server: ServerImplemented) {
        let promise = new Promise<IPomelo>((resolve, reject) => {
            server.disConnect(() => {
                server.init((err: Error, res: IPomelo) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                });
            });
        });

        return await promise;
    }

    export async function geteEnter(server: ServerImplemented, message: IDictionary) {
        let connector = await server.gateEnter(message);
        return connector;
    }

    export async function handshake(server: ServerImplemented, params: Stalk.ServerParam) {
        return await new Promise<any>((resolve, reject) => {
            server.connect(params, (err) => {
                server._isConnected = true;
                let socket = server.getSocket();
                if (!!socket) {
                    server.listenForPomeloEvents();
                    socket.setReconnect(true);
                }

                if (!!err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }

    export async function checkIn(server: ServerImplemented, message: IDictionary) {
        let result = await server.getLobby().checkIn(message);
        return result;
    }

    export function checkOut(server: ServerImplemented) {
        if (server) {
            let socket = server.getSocket();
            if (!!socket) {
                socket.setReconnect(false);
            }

            server.getLobby().logout();
            server.dispose();
        }
    }
}