import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class AppointmentGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const { userId, role } = client.handshake.query;

    if (role === 'doctor') {
      const room = `doctor_${userId}`;
      client.join(room);

    }
  }

  sendToDoctor(doctorId: number, data: any) {
    this.server.to(`doctor_${doctorId}`).emit('appointment:new', data);
  }
}
