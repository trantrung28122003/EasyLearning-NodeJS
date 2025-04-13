import { WebSocketProvider } from "./contexts/WebSocketContext";
import ApplicationRoutes from "./routes/ApplicationRoutes";

const App = () => {
  return (
    <>
      <WebSocketProvider>
        <ApplicationRoutes />
      </WebSocketProvider>
    </>
  );
};

export default App;
