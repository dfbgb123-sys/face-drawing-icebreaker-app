import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(apiBase: string): Socket {
  const ref = useRef<Socket | null>(null);
  if (!ref.current) {
    ref.current = io(apiBase, { transports: ['websocket'] });
  }

  useEffect(() => {
    const socket = ref.current;
    return () => {
      socket?.disconnect();
    };
  }, []);

  return ref.current;
}
