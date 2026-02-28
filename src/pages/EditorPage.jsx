import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "../components/Editor";
import { calculateAuthorshipScore } from "../utils/scoring";
// Import the hatching asset for the submit button
import hatchBg from "../assets/y-hatch.png";

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [events, setEvents] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [replayIndex, setReplayIndex] = useState(null);
  const [sessionStart] = useState(Date.now());
  const [docTitle, setDocTitle] = useState("");

  // Load document data from local storage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("studentDocuments")) || [];
    const found = stored.find((doc) => String(doc.id) === String(id));
    if (found) {
      setContent(found.content);
      setEvents(found.events);
      setSnapshots(found.snapshots);
      setDocTitle(found.title || "untitled doc");
    }
  }, [id]);

  // Calculations
  const { score, breakdown } = calculateAuthorshipScore(events);
  const isReplaying = replayIndex !== null;
  const sessionDuration = Math.floor((Date.now() - sessionStart) / 1000);

  // Function to handle submission
  const handleSubmit = () => {
    const submissions = JSON.parse(localStorage.getItem("submissions")) || [];
    const newSubmission = {
      id,
      studentName: "Navaneetha Rajesh", // Replace with dynamic user data if available
      content,
      events,
      snapshots,
      score,
      breakdown,
      duration: sessionDuration,
      timestamp: Date.now()
    };
    
    localStorage.setItem("submissions", JSON.stringify([...submissions, newSubmission]));
    alert("Assignment submitted successfully!");
    navigate("/student");
  };

  return (
    <div className="h-screen flex flex-col font-['Schoolbell'] text-[#1a1a1a] bg-[#FFFEF4]">
      
      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT PANEL: ANALYTICS */}
        <aside className="w-[300px] bg-[#FFF9C4] p-6 border-r-4 border-black border-dashed relative">
          <button onClick={() => navigate("/student")} className="text-3xl mb-8 flex items-center gap-2">
            ← analytics panel
          </button>

          <div className="space-y-8">
            {/* Confidence Meter */}
            <div>
              <p className="text-xl lowercase">confidence meter:</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex-1 h-1 bg-black relative">
                  <div 
                    className="absolute w-4 h-4 bg-white border-2 border-black rounded-full -top-1.5" 
                    style={{ left: `${score}%` }}
                  />
                </div>
                <span className="text-lg">{score}%</span>
              </div>
            </div>

            {/* Integrity Badge */}
            <div>
              <p className="text-xl lowercase border-b-2 border-black inline-block pr-4">
                integrity badge: <span className="font-bold">{score >= 70 ? "100% human" : "mixed"}</span>
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="p-4 border-2 border-black rounded-lg bg-white/50">
              <p className="text-xl mb-2 lowercase">score breakdown:</p>
              <ul className="space-y-1 text-lg">
                <li>writing activity: {breakdown.writing}</li>
                <li>revision depth: {breakdown.revision}</li>
                <li>low paste dependency: {breakdown.pastePenalty}</li>
                <li>consistency bonus: {breakdown.consistency}</li>
              </ul>
            </div>

            {/* AI Transparency Log */}
            <div>
              <p className="text-xl border-b-2 border-black inline-block pr-4 lowercase mb-2">
                ai transparency log:
              </p>
              <ul className="text-lg space-y-1">
                <li>total pastes: {events.filter(e => e.event_type === "paste").length}</li>
                <li>ai declarations: {events.filter(e => e.metadata?.ai_declared).length}</li>
                <li>session duration: {sessionDuration}s</li>
              </ul>
            </div>
          </div>
        </aside>

        {/* RIGHT PANEL: EDITOR */}
        <main className="flex-1 p-10 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl lowercase">editor</h1>
            
            {/* SUBMIT BUTTON */}
            <button 
              onClick={handleSubmit}
              className="px-10 py-1 border-2 border-black text-2xl lowercase hover:opacity-80 transition-opacity"
              style={{ 
                backgroundImage: `url(${hatchBg})`,
                backgroundSize: '150%',
                backgroundPosition: 'center',
                borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px" 
              }}
            >
              submit
            </button>
          </div>

          <div className="flex-1 border-4 border-black p-4 bg-white relative">
            <Editor
              content={isReplaying ? snapshots[replayIndex]?.content || "" : content}
              setContent={setContent}
              events={events}
              setEvents={setEvents}
              snapshots={snapshots}
              setSnapshots={setSnapshots}
              isReplaying={isReplaying}
            />
          </div>
        </main>
      </div>

      {/* FOOTER: TIMELINE REPLAY */}
      <footer className="bg-black text-white p-4 flex items-center justify-between gap-8 h-20">
        <div className="flex flex-col min-w-[150px]">
          <span className="text-xl lowercase">timeline replay:</span>
          <span className="text-sm">
            {snapshots.length > 0 
              ? `${replayIndex !== null ? replayIndex + 1 : snapshots.length} / ${snapshots.length}` 
              : "0 / 0"}
          </span>
        </div>

        <div className="flex-1 relative flex items-center h-full">
          <div className="absolute w-full h-[2px] bg-white/30"></div>
          <div 
            className="absolute h-[2px] bg-[#FFF176]" 
            style={{ 
              width: `${snapshots.length > 1 
                ? ((replayIndex !== null ? replayIndex : snapshots.length - 1) / (snapshots.length - 1)) * 100 
                : 0}%` 
            }}
          ></div>

          <input
            type="range"
            min="0"
            max={snapshots.length > 0 ? snapshots.length - 1 : 0}
            value={replayIndex !== null ? replayIndex : snapshots.length - 1}
            onChange={(e) => setReplayIndex(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          <div 
            className="absolute w-4 h-4 bg-[#FFF176] rounded-full shadow-[0_0_10px_rgba(255,241,118,0.5)] pointer-events-none"
            style={{ 
              left: `${snapshots.length > 1 
                ? ((replayIndex !== null ? replayIndex : snapshots.length - 1) / (snapshots.length - 1)) * 100 
                : 0}%`,
              transform: 'translateX(-50%)'
            }}
          ></div>
        </div>

        <button 
          onClick={() => setReplayIndex(null)}
          className={`border-2 px-8 py-1 text-xl lowercase transition-colors ${
            replayIndex === null 
            ? "bg-[#FFF176] text-black border-[#FFF176]" 
            : "border-white text-white hover:bg-white hover:text-black"
          }`}
        >
          live
        </button>
      </footer>
    </div>
  );
}