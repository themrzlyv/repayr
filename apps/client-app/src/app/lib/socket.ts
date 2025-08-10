import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initSocket(token: string) {
  if (socket) {
    try {
      socket.removeAllListeners();
      socket.disconnect();
    } catch {}
    socket = null;
  }

  const url = `${import.meta.env.VITE_APP_API_URL}/realtime`;

  socket = io(url, {
    auth: { token },
    withCredentials: true,
    transports: ["websocket"],
    autoConnect: true,
  });

  socket.on("connect_error", err => {
    console.warn("[WS] connect_error:", err?.message, err);
  }); // for handling connection errors

  if (import.meta.env.DEV) {
    socket.onAny((event, ...args) => {
      console.log("[WS] onAny:", event, args?.[0]);
    });
  }

  return socket;
}

export function getSocketOrNull(): Socket | null {
  return socket;
}

export function destroySocket() {
  if (socket) {
    try {
      socket.removeAllListeners();
      socket.disconnect();
    } catch {}
    socket = null;
  }
}
