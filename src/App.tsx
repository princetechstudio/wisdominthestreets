import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Shell from "./admin/Shell";
import Dashboard from "./admin/Dashboard";
import EpisodesAdmin from "./admin/Episodes";
import QuotesAdmin from "./admin/Quotes";
import MessagesAdmin from "./admin/Messages";
import SettingsAdmin from "./admin/Settings";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Shell />}>
            <Route index element={<Dashboard />} />
            <Route path="episodes" element={<EpisodesAdmin />} />
            <Route path="quotes" element={<QuotesAdmin />} />
            <Route path="messages" element={<MessagesAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </MotionConfig>
  );
}
