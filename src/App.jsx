import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import EditorPage from "./pages/EditorPage";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import DocumentView from "./pages/DocumentView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<StudentDashboard />} />
      <Route path="/student/doc/:id" element={<EditorPage />} />
        <Route path="/professor" element={<ProfessorDashboard />} />
        <Route path="/professor/doc/:id" element={<DocumentView />} />
      </Routes>
    </Router>
  );
}

export default App;