import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import Editor from "../components/Editor";
import y1Hatch from "../assets/y1-hatch.png";

export default function DocumentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const certificateRef = useRef(null);
  
  const [doc, setDoc] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [replayIndex, setReplayIndex] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("submissions")) || [];
    const found = stored.find((s) => String(s.id) === String(id));
    setDoc(found);
  }, [id]);

  const downloadCertificate = async () => {
    if (certificateRef.current) {
      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: "#FFFEF4",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `WordTrace_Certificate_${doc.studentName || "Student"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  if (!doc) return <div className="p-10 font-['Schoolbell']">Loading...</div>;

  const snapshots = doc.snapshots || [];
  const events = doc.events || [];
  const isReplaying = replayIndex !== null;
  const scoreValue = typeof doc.score === "object" ? doc.score.score : doc.score;

  return (
    <div className="h-screen flex flex-col font-['Schoolbell'] text-[#1a1a1a] bg-[#FFFEF4]">
      
      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* EDITOR AREA (Left) */}
        <main className="flex-1 p-10 flex flex-col relative">
          <button onClick={() => navigate("/professor")} className="text-4xl absolute left-10 top-8 hover:opacity-70">←</button>
          <h1 className="text-4xl text-center mb-6 lowercase">content:</h1>
          <div className="flex-1 border-2 border-black p-4 bg-white relative">
            <Editor
              content={isReplaying ? snapshots[replayIndex]?.content || "" : doc.content}
              readOnly={true}
              className="w-full h-full text-2xl focus:outline-none"
            />
          </div>
        </main>

        {/* ANALYTICS PANEL (Right) */}
        <aside className="w-[380px] bg-[#FFF9C4] p-8 border-l-4 border-black border-dashed flex flex-col gap-10 overflow-y-auto">
          <h2 className="text-4xl lowercase underline decoration-2 underline-offset-8">AI transparency log</h2>
          
          <div className="space-y-6 text-2xl lowercase">
            <div>
              <p>total pastes:</p>
              <p className="pl-4">{events.filter(e => e.event_type === "paste").length}</p>
            </div>
            <div>
              <p>AI declarations:</p>
              <p className="pl-12 text-lg text-gray-500 italic">external contents</p>
              <p className="pl-4">{events.filter(e => e.metadata?.ai_declared).length}</p>
            </div>
            <div>
              <p>session duration:</p>
              <p className="pl-4">{doc.duration || 0}s</p>
            </div>
          </div>
        </aside>
      </div>

      {/* FOOTER: TIMELINE & REPORT BUTTON */}
      <footer className="bg-black text-white p-6 flex items-center justify-between gap-10 h-24">
        <div className="flex flex-col min-w-[150px]">
          <span className="text-2xl lowercase">timeline replay:</span>
          <span className="text-lg">{snapshots.length > 0 ? `${replayIndex !== null ? replayIndex + 1 : snapshots.length} / ${snapshots.length}` : "0 / 0"}</span>
        </div>

        {/* STRAIGHT TIMELINE */}
        <div className="flex-1 relative flex items-center h-full">
          <div className="absolute w-full h-[3px] bg-white"></div>
          <div className="absolute h-[3px] bg-[#FFF176]" style={{ width: `${snapshots.length > 1 ? ((replayIndex !== null ? replayIndex : snapshots.length - 1) / (snapshots.length - 1)) * 100 : 0}%` }}></div>
          <input
            type="range"
            min="0"
            max={snapshots.length > 0 ? snapshots.length - 1 : 0}
            value={replayIndex !== null ? replayIndex : snapshots.length - 1}
            onChange={(e) => setReplayIndex(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="absolute w-5 h-5 bg-[#FFF176] rounded-full border-2 border-black pointer-events-none" style={{ left: `${snapshots.length > 1 ? ((replayIndex !== null ? replayIndex : snapshots.length - 1) / (snapshots.length - 1)) * 100 : 0}%`, transform: 'translateX(-50%)' }}></div>
        </div>

        <button 
          onClick={() => setShowCertificate(true)} 
          className="border-2 border-white px-10 py-2 text-2xl lowercase hover:bg-white hover:text-black transition-all"
        >
          report
        </button>
      </footer>

      {/* REPORT CERTIFICATE MODAL */}
      {showCertificate && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#FFFEF4] w-full max-w-4xl relative max-h-[90vh] flex flex-col">
            
            {/* Pinned Control Buttons */}
            <div className="absolute -top-12 right-0 flex gap-3">
               <button 
                 onClick={downloadCertificate} 
                 className="bg-[#FFF176] border-2 border-black px-4 py-1 text-lg shadow-[3px_3px_0_0_black] hover:translate-y-px hover:shadow-none transition-all"
               >
                 print/download png
               </button>
               <button 
                 onClick={() => setShowCertificate(false)} 
                 className="bg-white border-2 border-black px-4 py-1 text-lg"
               >
                 close
               </button>
            </div>

            {/* SCROLLABLE COMPACT CERTIFICATE AREA */}
            <div className="overflow-y-auto custom-scrollbar">
              <div ref={certificateRef} className="bg-[#FFFEF4] p-10 border-4 border-black m-2 text-[#1a1a1a]">
                <h1 className="text-4xl text-center mb-8 lowercase font-bold decoration-1">WordTrace Report</h1>
                
                {/* Compact Highlighted Name */}
                <div className="flex justify-center mb-10">
                  <div 
                    className="px-12 py-2 text-2xl lowercase text-center flex items-center justify-center"
                    style={{ backgroundImage: `url(${y1Hatch})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }}
                  >
                    {doc.studentName || "student name"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-10">
                  {/* AI Transparency Log */}
                  <div className="space-y-4">
                    <h2 className="text-2xl lowercase border-b-2 border-black pb-1 inline-block">AI transparency log</h2>
                    <div className="text-xl space-y-2 lowercase">
                      <p>total pastes: {events.filter(e => e.event_type === "paste").length}</p>
                      <div className="flex gap-2">
                        <span>AI declarations:</span>
                        
                        <div className="text-sm text-gray-500 italic">
                          <p>external contents</p>
                          <p>external contents</p>
                        </div>
                      </div>
                      <p>session duration: {doc.duration || 0}s</p>
                    </div>
                  </div>

                  {/* Score Breakdown & Meter */}
                  <div className="space-y-4">
                    <h2 className="text-2xl lowercase border-b-2 border-black pb-1 inline-block">score breakdown</h2>
                    <div className="text-lg space-y-1 lowercase">
                      <p>writing activity: {doc.breakdown?.writing || 0}</p>
                      <p>revision depth: {doc.breakdown?.revision || 0}</p>
                      <p>low paste dependency: {doc.breakdown?.pastePenalty || 0}</p>
                      <p>consistency bonus: {doc.breakdown?.consistency || 0}</p>
                    </div>

                    {/* Compact Meter Box */}
                    <div className="border-2 border-black p-4 mt-4 bg-[#FFFEF4] relative shadow-[2px_2px_0_0_black]">
                      <p className="text-base lowercase mb-3 font-bold">confidence meter:</p>
                      <div className="flex items-center gap-4">
                          <div className="flex-1 h-[2px] bg-black relative">
                              <div className="absolute w-4 h-4 bg-[#FFF176] border-2 border-black rounded-full -top-1.5" style={{ left: `${scoreValue}%`, transform: 'translateX(-50%)' }}></div>
                          </div>
                          <span className="text-2xl font-bold">{scoreValue}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}