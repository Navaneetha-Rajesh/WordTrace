import { useState } from "react";
import Editor from "../components/Editor";
import { calculateAuthorshipScore } from "../utils/scoring";

export default function StudentPortal() {
  const [content, setContent] = useState("");
  const [events, setEvents] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [replayIndex, setReplayIndex] = useState(null);
  const score = calculateAuthorshipScore(events);
  const pasteEvents = events.filter(e => e.event_type === "paste");
  const aiDeclaredCount = pasteEvents.filter(
  e => e.metadata?.ai_declared
  ).length;

  let badgeLabel = "";
  let badgeColor = "";

if (score >= 75) {
  badgeLabel = "Authentic Process";
  badgeColor = "bg-green-500";
} else if (score >= 40) {
  badgeLabel = "Mixed Contribution";
  badgeColor = "bg-yellow-400";
} else {
  badgeLabel = "High External Dependency";
  badgeColor = "bg-red-500";
}

  const isReplaying = replayIndex !== null;

  return (
    <div className="h-screen flex flex-col">

      {/* Main Section */}
      <div className="flex flex-1">

        {/* LEFT PANEL */}
        <div className="w-1/3 border-r p-4 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Analytics Panel</h2>
          <div className="mb-4">
            <p className="font-semibold">Authorship Confidence</p>
            <div className="w-full bg-gray-200 rounded h-4 mt-2">
                <div
                className="bg-green-500 h-4 rounded"
                style={{ width: `${score}%` }}
                ></div>
            </div>
            <p className="text-sm mt-1">{score}% Human Authored</p>
            </div>
          <div className="mb-4">
        <p className="font-semibold">Integrity Badge</p>
        <div className={`mt-2 px-3 py-2 text-white rounded ${badgeColor}`}>
            {badgeLabel}
        </div>
        </div>
          <div className="mb-4">Score Breakdown</div>
          <div className="mt-4">
  <p className="font-semibold mb-2">AI Transparency Log</p>

  <p className="text-sm mb-1">
    Total Paste Events: {pasteEvents.length}
  </p>

  <p className="text-sm mb-2">
    AI Declared Uses: {aiDeclaredCount}
  </p>

  <div className="max-h-32 overflow-y-auto text-xs bg-gray-100 p-2 rounded">
    {pasteEvents.length === 0 ? (
      <p>No external content used.</p>
    ) : (
      pasteEvents.map((event, index) => (
        <div key={index} className="mb-2">
          <p><strong>Source:</strong> {event.metadata?.source || "Not specified"}</p>
          <p><strong>Reason:</strong> {event.metadata?.explanation || "Not provided"}</p>
          <p><strong>AI Used:</strong> {event.metadata?.ai_declared ? "Yes" : "No"}</p>
          <hr className="my-1"/>
        </div>
      ))
    )}
    </div>
    </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-2/3 p-4">
          <h2 className="text-xl font-semibold mb-4">Editor</h2>

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
      </div>

      {/* Replay Slider */}
      <div className="border-t p-4 bg-white">
        <h2 className="text-lg font-semibold mb-2">Timeline Replay</h2>

        {snapshots.length > 0 ? (
          <>
            <p className="text-sm mb-2">
              Snapshots captured: {snapshots.length}
            </p>

            <input
              type="range"
              min="0"
              max={snapshots.length - 1}
              value={replayIndex ?? snapshots.length - 1}
              onChange={(e) => setReplayIndex(Number(e.target.value))}
              className="w-full"
            />

            {replayIndex !== null && (
              <div className="mt-3 p-3 bg-yellow-100 rounded">
                <p className="text-sm font-medium">
                  Replay Mode Active
                </p>
                <p className="text-xs text-gray-600">
                  Snapshot Time:{" "}
                  {new Date(
                    snapshots[replayIndex]?.timestamp
                  ).toLocaleTimeString()}
                </p>

                <button
                  onClick={() => setReplayIndex(null)}
                  className="mt-2 px-4 py-1 bg-black text-white rounded text-sm"
                >
                  Return to Live
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500">
            No snapshots yet. Start writing to capture timeline.
          </p>
        )}
      </div>
    </div>
  );
}