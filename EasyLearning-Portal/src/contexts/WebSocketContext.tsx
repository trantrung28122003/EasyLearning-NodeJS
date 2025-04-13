import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import io, { Socket } from "socket.io-client";
const WebSocketContext = createContext<Socket | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};
