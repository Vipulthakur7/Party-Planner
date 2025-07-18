import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CreateParty from "./components/CreateParty";
import RSVPPage from "./components/RSVPPage";
import AdminSummary from "./components/AdminSummary";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/create" />} />
        <Route path="/create" element={<CreateParty />} />
        <Route path="/rsvp/:id" element={<RSVPPage />} />
        <Route path="/admin/:id" element={<AdminSummary />} />
      </Routes>
    </Router>
  );
}
