import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { Socket } from 'net';
import { StreamConnector, StreamType } from '@frejun/teler';
import { config } from '../core/config';
import { callStreamHandler, remoteStreamHandler } from './streamHandlers';
import { GrokClient } from './grokClient';

export const wss = new WebSocketServer({ noServer: true });

wss.on('connection', async (telerWs: WebSocket) => {
  console.info('Teler WebSocket connected');
  
  if (!config.XAIApiKey) {
    console.error('GROK_API_KEY not configured');
    telerWs.close(1008, 'GROK_API_KEY not configured');
    return;
  }
  
  const grokClient = new GrokClient(config.XAIApiKey, 300);
  const flag = await grokClient.getSecret();
  
  if(!flag) {
    console.error('GROK Secret Error');
    telerWs.close(1008, 'GROK sent no Secret');
    return;
  }

  const remoteHeaders = grokClient.getRemoteHeaders();
  
  const connector = new StreamConnector(
    config.XAIWsUrl,
    StreamType.BIDIRECTIONAL,
    callStreamHandler,
    remoteStreamHandler(),
    remoteHeaders
  );

  await connector.bridgeStream(telerWs);
});

export const handleUpgrade = (request: IncomingMessage, socket: Socket, head: Buffer) => {
  if (request.url === '/api/v1/media-stream') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws);
    });
  } else {
    socket.destroy();
  }
};