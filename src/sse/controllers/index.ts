import { NextFunction, Request, Response } from 'express';
import sseClientManager from '../sseClientManager';

export function addSseClient(req: Request, res: Response, next: NextFunction) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Connection', 'keep-alive');

  res.write(`data: Connected to SSE\n\n`);
  sseClientManager.addClient(res);

  const keepAliveInterval = setInterval(() => {
    res.write(`: keep-alive\n\n`);
  }, 20000);

  req.on('close', () => {
    clearInterval(keepAliveInterval);
    sseClientManager.removeClient(res);
  });
}
