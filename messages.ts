import { Socket } from 'socket.io';


export default class MessageHandler {

    public static async sendError(socket: Socket, content: string, title = "You've made the server very angry >:(") {

        const parsedMessage = {
            content,
            title,
            type: 'error'
        }

        socket.emit('message', parsedMessage);
    }
}