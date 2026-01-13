// -*- coding: utf-8 -*-
import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 3000;  // Render sets PORT automatically

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", ws => {
  ws.on("message", msg => {
    for (const client of wss.clients) {
      if (client.readyState === ws.OPEN) {
        client.send(msg);
      }
    }
  });
});

console.log(`Morse WebSocket running on port ${PORT}`);
