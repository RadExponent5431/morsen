# morsen.radexponent.de

A real-time, multi-user **live Morse (CW) web application**.  
Each connected user gets their own virtual “lamp” and can send Morse code live via keyboard, mouse, or touch. Sessions disappear automatically after inactivity or when a user leaves.

**Live demo:** https://morsen.radexponent.de

---

## Features

- 🔴 **Live Morse over WebSockets**
- 💡 **One lamp per user session**
- ⌨️ Input via **spacebar**, mouse, or touch
- 🔊 Real-time **audio tone** (CW-style)
- 🕒 **Automatic session cleanup**
  - Lamp removed after **20 seconds of inactivity**
  - Lamp removed immediately on tab close / disconnect
- 🌐 Works across devices and browsers
- 🔐 Secure `wss://` WebSocket connection

---

## Architecture

- **Frontend**: Static HTML, CSS, JavaScript  
- **Backend**: Node.js WebSocket server (`ws`)
- **Hosting**:
  - UI: All-Inkl
  - WebSocket server: Render

---

## Repository Structure

.
├─ server.js        # Node.js WebSocket server
├─ package.json     # Node dependencies and start script
└─ index.html       # Frontend (can also be hosted separately)

---

## WebSocket Protocol

Messages are JSON-based.
