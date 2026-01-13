// -*- coding: utf-8 -*-
import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 3000;
const wss = new WebSocketServer({ port: PORT });

const SESSIONS = {}; // sessionId -> { ws, lastActive }

function broadcast(msg) {
  const str = JSON.stringify(msg);
  for (const client of wss.clients) {
    if (client.readyState === ws.OPEN) client.send(str);
  }
}

// Remove inactive sessions every 5 seconds
setInterval(() => {
  const now = Date.now();
  for (const id in SESSIONS) {
    if (now - SESSIONS[id].lastActive > 20000) { // 20 seconds
      broadcast({ type: "remove", sessionId: id });
      delete SESSIONS[id];
    }
  }
}, 5000);

wss.on("connection", ws => {
  const sessionId = Math.random().toString(36).substring(2, 10);
  ws.sessionId = sessionId;
  SESSIONS[sessionId] = { ws, lastActive: Date.now() };

  // Send session ID to client
  ws.send(JSON.stringify({ type: "session", id: sessionId }));

  ws.on("message", msg => {
    const data = JSON.parse(msg.toString());

    // Update last active timestamp
    SESSIONS[sessionId].lastActive = Date.now();

    // Attach sessionId if missing
    if (!data.sessionId) data.sessionId = sessionId;

    // Broadcast to everyone
    for (const client of wss.clients) {
      if (client.readyState === ws.OPEN) client.send(JSON.stringify(data));
    }
  });

  ws.on("close", () => {
    delete SESSIONS[sessionId];
    broadcast({ type: "remove", sessionId });
  });
});

console.log(`Morse WS running on port ${PORT}`);
