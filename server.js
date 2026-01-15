// -*- coding: utf-8 -*-
import { WebSocketServer, WebSocket } from "ws";

const PORT = process.env.PORT || 3000;
const wss = new WebSocketServer({ port: PORT });

const SESSIONS = {}; // sessionId -> { ws, lastActive }

function broadcast(msg) {
  const str = JSON.stringify(msg);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(str);
      } catch (err) {
        console.error("Broadcast error:", err);
      }
    }
  }
}

// Remove inactive sessions every 5 seconds
setInterval(() => {
  const now = Date.now();
  for (const id in SESSIONS) {
    if (now - SESSIONS[id].lastActive > 20000) { // 20 seconds inactivity
      broadcast({ type: "remove", sessionId: id });
      try {
        SESSIONS[id].ws.close();
      } catch {}
      delete SESSIONS[id];
    }
  }
}, 5000);

wss.on("connection", ws => {
  const sessionId = Math.random().toString(36).substring(2, 10);
  ws.sessionId = sessionId;
  SESSIONS[sessionId] = { ws, lastActive: Date.now() };

  // Send session ID to client
  try {
    ws.send(JSON.stringify({ type: "session", id: sessionId }));
  } catch (err) {
    console.error("Initial send failed:", err);
  }

  ws.on("message", msg => {
    let data;
    try {
      data = JSON.parse(msg.toString());
    } catch {
      return; // ignore invalid JSON
    }

    if (!SESSIONS[sessionId]) return; // session might have been deleted
    SESSIONS[sessionId].lastActive = Date.now();

    if (!data.sessionId) data.sessionId = sessionId;

    broadcast(data);
  });

  ws.on("close", () => {
    if (SESSIONS[sessionId]) {
      delete SESSIONS[sessionId];
      broadcast({ type: "remove", sessionId });
    }
  });

  ws.on("error", (err) => {
    console.error("WebSocket error for session", sessionId, err);
  });
});

wss.on("error", (err) => {
  console.error("WebSocketServer error:", err);
});

console.log(`Morse WS running on port ${PORT}`);
