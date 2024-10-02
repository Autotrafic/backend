import { Response } from 'express';

class SSEClientManager {
  private clients: Response[] = [];

  addClient(res: Response): void {
    this.clients.push(res);
  }

  removeClient(res: Response): void {
    this.clients = this.clients.filter(client => client !== res);
  }

  broadcast(eventType: string, data: object): void {
    const message = JSON.stringify(data);
    this.clients.forEach(client => {
      client.write(`event: ${eventType}\n`);
      client.write(`data: ${message}\n\n`);
    });
  }
}

export default new SSEClientManager();