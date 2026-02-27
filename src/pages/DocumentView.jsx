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
    return <p className="p-6">Loading...</p>;
  }

  const isReplaying = replayIndex !== null;

  const displayedContent = isReplaying
    ? submission.snapshots?.[replayIndex]?.content
    : submission.content;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Submission Review
      </h1>

      <div className="mb-4">
        <strong>Score:</strong>{" "}
        {typeof submission.score === "object"
          ? submission.score.score
          : submission.score}
        %
      </div>

      <div className="border p-4 mb-4 h-64 overflow-auto bg-gray-50">
        <pre className="whitespace-pre-wrap text-sm">
          {displayedContent}
        </pre>
      </div>

      {submission.snapshots && submission.snapshots.length > 0 && (
        <div className="mb-6">
          <input
            type="range"
            min="0"
            max={submission.snapshots.length - 1}
            value={
              replayIndex !== null
                ? replayIndex
                : submission.snapshots.length - 1
            }
            onChange={(e) =>
              setReplayIndex(Number(e.target.value))
            }
            className="w-full"
          />

          {replayIndex !== null && (
            <button
              onClick={() => setReplayIndex(null)}
              className="mt-2 px-3 py-1 bg-black text-white rounded"
            >
              Return to Final Version
            </button>
          )}
        </div>
      )}

      <div>
        <h2 className="font-semibold mb-2">
          AI Transparency Log
        </h2>

        {submission.events
          ?.filter((e) => e.event_type === "paste")
          .map((e, i) => (
            <div key={i} className="mb-3 text-sm">
              <p>
                <strong>Source:</strong> {e.metadata?.source}
              </p>
              <p>
                <strong>Reason:</strong>{" "}
                {e.metadata?.explanation}
              </p>
              <p>
                <strong>AI Used:</strong>{" "}
                {e.metadata?.ai_declared ? "Yes" : "No"}
              </p>
              <hr />
            </div>
          ))}
      </div>
    </div>
  );
}