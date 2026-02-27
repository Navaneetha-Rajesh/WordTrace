import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import StudentPortal from "./pages/StudentPortal";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import DocumentView from "./pages/DocumentView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<StudentPortal />} />
        <Route path="/professor" element={<ProfessorDashboard />} />
        <Route path="/professor/doc/:id" element={<DocumentView />} />
      </Routes>
    </Router>
  );
}

export default App;