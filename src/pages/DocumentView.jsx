import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DocumentView() {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [replayIndex, setReplayIndex] = useState(null);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("submissions")) || [];

    const found = stored.find(
      (s) => String(s.id) === String(id)
    );

    setSubmission(found);
  }, [id]);

  if (!submission) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <p className="text-gray-500 animate-pulse">Loading submission details...</p>
      </div>
    );
  }

  const isReplaying = replayIndex !== null;

  // Uses the snapshot content if replaying, otherwise the final content
  const displayedContent = isReplaying
    ? submission.snapshots?.[replayIndex]?.content
    : submission.content;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {/* Displays the document name instead of just 'Submission Review' */}
          Review: {submission.title || `Submission ${submission.id}`}
        </h1>
        <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
          Score: {typeof submission.score === "object" ? submission.score.score : submission.score}%
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                {isReplaying ? "Replay Mode: Snapshot View" : "Final Submission Content"}
              </span>
              {isReplaying && (
                <button
                  onClick={() => setReplayIndex(null)}
                  className="text-xs bg-black text-white px-2 py-1 rounded"
                >
                  Exit Replay
                </button>
              )}
            </div>
            <div className="p-4 h-[500px] overflow-auto">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                {displayedContent || "No content available."}
              </pre>
            </div>
          </div>

          {/* Timeline Controls */}
          {submission.snapshots && submission.snapshots.length > 0 ? (
            <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
              <div className="flex justify-between mb-2">
                <h2 className="font-semibold text-gray-700">Writing Timeline</h2>
                <span className="text-xs text-gray-500">
                  {submission.snapshots.length} Snapshots captured
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={submission.snapshots.length - 1}
                value={isReplaying ? replayIndex : submission.snapshots.length - 1}
                onChange={(e) => setReplayIndex(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <div className="flex justify-between mt-2 text-[10px] text-gray-400 uppercase tracking-widest">
                <span>Start</span>
                <span>Final Version</span>
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 border border-dashed rounded-lg text-center text-gray-400">
              No timeline snapshots available for this submission.
            </div>
          )}
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          <div className="p-4 border rounded-lg bg-white shadow-sm">
            <h2 className="font-bold mb-4 border-b pb-2">AI Transparency Log</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {submission.events?.filter((e) => e.event_type === "paste").length > 0 ? (
                submission.events
                  ?.filter((e) => e.event_type === "paste")
                  .map((e, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded border text-sm">
                      <p className="mb-1 text-xs font-bold text-gray-500 uppercase">External Source</p>
                      <p className="font-medium text-gray-800">{e.metadata?.source || "Unknown"}</p>
                      <p className="mt-2 text-gray-600 italic">"{e.metadata?.explanation || "No explanation provided."}"</p>
                      <div className="mt-2 flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${e.metadata?.ai_declared ? "bg-red-500" : "bg-green-500"}`}></span>
                        <span className="text-xs font-semibold">AI Used: {e.metadata?.ai_declared ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No paste events detected.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}