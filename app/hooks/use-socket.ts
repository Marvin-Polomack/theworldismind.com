'use client';

import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { set } from "date-fns";

export default function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);


  useEffect(() => {
    if (!socket) {
      try {
        const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
        console.log("Socket connected", process.env.NEXT_PUBLIC_SOCKET_URL);

        newSocket.on('connect', () => setIsConnected(true));
        newSocket.on('disconnect', () => setIsConnected(false));

        setSocket(newSocket);
      } catch (error) {
        console.error("WebSocket connection failed:", error);
      }
    }

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, []);

  console.log("New user connected:", socket);
  return socket;
}