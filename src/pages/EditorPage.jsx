import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "../components/Editor";
import { calculateAuthorshipScore } from "../utils/scoring";

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [events, setEvents] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [replayIndex, setReplayIndex] = useState(null);
  const [sessionStart] = useState(Date.now());

  // Calculations
  const { score, breakdown } = calculateAuthorshipScore(events);
  const isReplaying = replayIndex !== null;
  const sessionDuration = Math.floor((Date.now() - sessionStart) / 1000);

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
          <h1 className="text-5xl mb-8 lowercase">editor</h1>
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
      <footer className="bg-black text-white p-4 flex items-center justify-between gap-8 h-24">
        <div className="flex flex-col min-w-[150px]">
          <span className="text-xl lowercase">timeline replay:</span>
          <span className="text-sm">{replayIndex !== null ? replayIndex + 1 : snapshots.length}/{snapshots.length}</span>
        </div>

        {/* Hand-drawn look slider */}
        <div className="flex-1 relative h-2">
          <div className="absolute inset-0 border-b-2 border-white border-dashed opacity-50" />
          <input
            type="range"
            min="0"
            max={snapshots.length > 0 ? snapshots.length - 1 : 0}
            value={replayIndex !== null ? replayIndex : snapshots.length - 1}
            onChange={(e) => setReplayIndex(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          {/* Custom Slider Track based on image */}
          <svg className="absolute top-0 w-full h-12 -translate-y-4 pointer-events-none overflow-visible">
            <path 
              d={`M 0 20 Q 50 10, 100 25 T 200 20 T 300 25 T 400 20 T 500 25 T 600 20 T 700 25 T 800 20`}
              fill="none" 
              stroke="white" 
              strokeWidth="3" 
            />
            <circle 
              cx={`${(replayIndex !== null ? replayIndex : snapshots.length - 1) / (snapshots.length - 1 || 1) * 100}%`} 
              cy="20" 
              r="8" 
              fill="#FFF176" 
            />
          </svg>
        </div>

        <button 
          onClick={() => setReplayIndex(null)}
          className="border-2 border-white px-8 py-2 text-2xl lowercase hover:bg-white hover:text-black transition-colors"
        >
          live
        </button>
      </footer>
    </div>
  );
}