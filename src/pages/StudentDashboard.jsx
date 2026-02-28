import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import personIcon from "../assets/person.png";
import hatchBg from "../assets/y-hatch.png";

export default function StudentDashboard() {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("studentDocuments")) || [];
    setDocuments(stored);
  }, []);

  const createNewDocument = () => {
    const newDoc = {
      id: Date.now(),
      title: `document - ${documents.length + 1}`, // Matches "document - 1" naming in sketch
      content: "",
      events: [],
      snapshots: [],
      score: 0,
      breakdown: {},
    };
    const updatedDocs = [...documents, newDoc];
    localStorage.setItem("studentDocuments", JSON.stringify(updatedDocs));
    setDocuments(updatedDocs);
    navigate(`/student/doc/${newDoc.id}`);
  };

  const hatchButtonStyle = {
    backgroundImage: `url(${hatchBg})`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    border: '2px solid black'
  };

  return (
    <div className="min-h-screen bg-[#FFFEF4] font-['Schoolbell'] text-[#1a1a1a] p-12">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start mb-20 relative">
        {/* Back Arrow */}
        <button onClick={() => navigate("/")} className="text-4xl">←</button>

        {/* User Info aligned to the right */}
        <div className="flex gap-4 items-center">
          <div className="text-right">
            <p className="text-2xl lowercase">name: examplexy</p>
            <p className="text-2xl lowercase">email: trial@gmail.com</p>
          </div>
          <div className="w-16 h-16 rounded-full border-2 border-black overflow-hidden bg-white">
            <img src={personIcon} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* NEW DOCUMENT BUTTON */}
      <div className="max-w-5xl mx-auto mb-8">
        <button
          onClick={createNewDocument}
          className="px-6 py-1 text-2xl lowercase"
          style={{ border: '2px solid black', borderRadius: '4px' }}
        >
          new document
        </button>
      </div>

      {/* VERTICAL DOCUMENT LIST */}
      <div className="max-w-5xl mx-auto space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => navigate(`/student/doc/${doc.id}`)}
            className="w- h-16 flex items-center justify-center cursor-pointer relative group"
            style={hatchButtonStyle}
          >
            <span className="text-3xl lowercase z-10 px-4">
              {doc.title}
            </span>
          </div>
        ))}

        {documents.length === 0 && (
          <p className="text-center text-gray-400 mt-20">No documents yet.</p>
        )}
      </div>
    </div>
  );
}