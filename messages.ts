import { Socket } from 'socket.io';


export default class MessageHandler {

    public static async sendError(socket: Socket, content: string, title = 'The server is very angry >:(') {

        const parsedMessage = {
            content: `${content} Try refreshing the page. If the problem persist, please contact the system administrator.`,
            title,
            type: 'error'
        }

        socket.emit('message', parsedMessage);
    }

    public static async sendWarning(socket: Socket, content: string, title = "I'm afraid I can't let you do that.") {
        const parsedMessage = {
            content,
            title,
            type: 'warning'
        }

        socket.emit('message', parsedMessage);
    }

    
}