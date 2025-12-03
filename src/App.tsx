import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/route";
import { useEffect } from "react";
import { loadUserFromRefresh } from "./service/auth";
import { io } from "socket.io-client";
import { decrypt } from "./utils/helper";
import { useAuthStore } from "./stores/auth";

function App() {
  const accessToken = localStorage.getItem("adminAccessToken");

  useEffect(() => {
    if (accessToken) {
      loadUserFromRefresh();

      const token = decrypt(accessToken);

      // 2️⃣ Kết nối WebSocket
      const socket = io("http://localhost:3000", {
        auth: { token },
      });

      useAuthStore.getState().setSocket(socket);

      // 🔹 Heartbeat
      const heartbeatInterval = setInterval(() => {
        socket?.emit("heartbeat");
      }, 30000); // 30s

      return () => {
        clearInterval(heartbeatInterval);
        socket.close();
      };
    }
  }, [accessToken]);

  return <RouterProvider router={router} />;
}

export default App;
