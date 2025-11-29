// src/hooks/useSocket.ts
// WebSocket hook for Socket.IO connection with auto-reconnect and JWT authentication
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";

let socketInstance: Socket | null = null;

/**
 * Custom hook for managing Socket.IO connection
 * Handles authentication, reconnection, and event subscriptions
 */
export const useSocket = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => !!state.accessToken);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    // Only connect if user is authenticated
    if (!isAuthenticated || !accessToken || !user) {
      // Disconnect if user logs out
      if (socketInstance?.connected) {
        socketInstance.disconnect();
        socketInstance = null;
      }
      return;
    }

    // Prevent duplicate connections
    if (socketInstance?.connected) {
      return;
    }

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    // Initialize Socket.IO connection with JWT token
    socketInstance = io(API_BASE_URL, {
      auth: {
        token: accessToken, // Primary method: auth header
      },
      query: {
        token: accessToken, // Fallback: query parameter
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000, // Start with 1 second
      reconnectionDelayMax: 5000, // Max 5 seconds
      reconnectionAttempts: maxReconnectAttempts,
      timeout: 20000,
    });

    // Connection event handlers
    socketInstance.on("connect", () => {
      console.log("✅ Socket.IO connected");
      reconnectAttempts.current = 0; // Reset on successful connection
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ Socket.IO disconnected:", reason);
      
      // Attempt reconnection with exponential backoff
      if (reason === "io server disconnect") {
        // Server disconnected, reconnect manually
        reconnectAttempts.current = 0;
      }
    });

    socketInstance.on("connect_error", (error) => {
      console.error("❌ Socket.IO connection error:", error.message);
      reconnectAttempts.current += 1;

      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.warn("⚠️ Max reconnection attempts reached");
      }
    });

    socketInstance.on("reconnect", (attemptNumber) => {
      console.log(`🔄 Socket.IO reconnected after ${attemptNumber} attempts`);
      reconnectAttempts.current = 0;
    });

    socketInstance.on("reconnect_attempt", (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}`);
    });

    socketInstance.on("reconnect_failed", () => {
      console.error("❌ Socket.IO reconnection failed");
    });

    // Health check ping/pong
    socketInstance.on("pong", (data) => {
      console.log("🏓 Pong received:", data);
    });

    // Cleanup on unmount or when auth state changes
    return () => {
      if (socketInstance && !isAuthenticated) {
        socketInstance.disconnect();
        socketInstance = null;
      }
    };
  }, [isAuthenticated, accessToken, user]);

  return socketInstance;
};

/**
 * Get the current socket instance (for use outside React components)
 */
export const getSocket = (): Socket | null => {
  return socketInstance;
};

