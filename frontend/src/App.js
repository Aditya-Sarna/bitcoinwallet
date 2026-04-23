import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./lib/theme";
import Onboarding from "./pages/Onboarding";
import Lock from "./pages/Lock";
import Home from "./pages/Home";
import Send from "./pages/Send";
import Receive from "./pages/Receive";
import Transactions from "./pages/Transactions";
import Rewards from "./pages/Rewards";
import Store from "./pages/Store";
import Profile from "./pages/Profile";
import Bills from "./pages/Bills";
import Backup from "./pages/Backup";
import Security from "./pages/Security";
import Scan from "./pages/Scan";
import Success from "./pages/Success";
import StoreItem from "./pages/StoreItem";

function Guard({ children }) {
  const token = localStorage.getItem("btc_token");
  const walletId = localStorage.getItem("btc_wallet_id");
  if (!walletId) return <Navigate to="/onboarding" replace />;
  if (!token) return <Navigate to="/lock" replace />;
  return children;
}

function Entry() {
  const token = localStorage.getItem("btc_token");
  const walletId = localStorage.getItem("btc_wallet_id");
  if (token) return <Navigate to="/home" replace />;
  if (walletId) return <Navigate to="/lock" replace />;
  return <Navigate to="/onboarding" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <BrowserRouter>
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "#141420",
              border: "1px solid rgba(212,255,79,0.25)",
              color: "#fff",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Entry />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/lock" element={<Lock />} />
          <Route path="/home" element={<Guard><Home /></Guard>} />
          <Route path="/send" element={<Guard><Send /></Guard>} />
          <Route path="/receive" element={<Guard><Receive /></Guard>} />
          <Route path="/transactions" element={<Guard><Transactions /></Guard>} />
          <Route path="/rewards" element={<Guard><Rewards /></Guard>} />
          <Route path="/store" element={<Guard><Store /></Guard>} />
          <Route path="/profile" element={<Guard><Profile /></Guard>} />
          <Route path="/bills" element={<Guard><Bills /></Guard>} />
          <Route path="/backup" element={<Guard><Backup /></Guard>} />
          <Route path="/security" element={<Guard><Security /></Guard>} />
          <Route path="/scan" element={<Guard><Scan /></Guard>} />
          <Route path="/success" element={<Guard><Success /></Guard>} />
          <Route path="/store/:id" element={<Guard><StoreItem /></Guard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}
