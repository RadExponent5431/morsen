// -*- coding: utf-8 -*-
import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 3000;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", ws => {
  // Assign a unique session ID for each client
  ws.sessionId = Math.random().toString(36).substring(2, 10);

  // Notify client of its session ID
  ws.send(JSON.stringify({ type: "session", id: ws.sessionId }));

  ws.on("message", msg => {
    // broadcast the message to all clients
    const data = JSON.parse(msg.toString());

    // Attach session ID if missing
    if (!data.sessionId) data.sessionId = ws.sessionId;

    for (const client of wss.clients) {
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify(data));
      }
    }
  });
});

console.log(`Morse WS running on port ${PORT}`);
