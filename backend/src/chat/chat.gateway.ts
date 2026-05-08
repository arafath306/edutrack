import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { content: string; senderId: string; chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    // In a real app, you would save to DB here via chatService
    // const message = await this.chatService.saveMessage(data);
    
    // Broadcast to all clients in the chat
    this.server.to(data.chatId).emit('messageReceived', {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    });
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.chatId);
    console.log(`Client ${client.id} joined chat ${data.chatId}`);
  }
}
