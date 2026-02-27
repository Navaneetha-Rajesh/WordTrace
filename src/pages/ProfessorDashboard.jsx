import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfessorDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("submissions")) || [];
    setSubmissions(stored);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Professor Dashboard
      </h1>

      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="p-4 border rounded flex justify-between items-center"
            >
              <div>
                <p><strong>Submission ID:</strong> {sub.id}</p>
                <p>
                <strong>Score:</strong>{" "}
                {typeof sub.score === "object" ? sub.score.score : sub.score}%
                </p>
              </div>

              <button
                onClick={() =>
                  navigate(`/professor/doc/${sub.id}`)
                }
                className="px-3 py-1 bg-black text-white rounded"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}