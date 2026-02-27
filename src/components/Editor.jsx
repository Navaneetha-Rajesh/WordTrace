import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";

export default function Editor({
  content,
  setContent,
  events,
  setEvents,
  snapshots,
  setSnapshots,
  isReplaying,
}) {
  // Fix 1: Keep the ref in sync with the content state
  const contentRef = useRef(content);
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  const [showModal, setShowModal] = useState(false);
  const [pendingPaste, setPendingPaste] = useState(null);
  const [source, setSource] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isAI, setIsAI] = useState(false);
  const { id } = useParams();

  const getWordCount = (text) => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  };

  const handleChange = (e) => {
    if (isReplaying) return;
    const newContent = e.target.value;

    const event = {
      id: uuidv4(),
      timestamp: Date.now(),
      event_type: "insert",
      word_count: getWordCount(newContent),
      metadata: {},
    };

    setEvents((prev) => [...prev, event]);
    setContent(newContent);
  };

  const handleKeyDown = (e) => {
    if (isReplaying) return;
    if (e.key === "Backspace") {
      const event = {
        id: uuidv4(),
        timestamp: Date.now(),
        event_type: "delete",
        word_count: getWordCount(contentRef.current),
        metadata: {},
      };
      setEvents((prev) => [...prev, event]);
    }
  };

  const handlePaste = (e) => {
    if (isReplaying) return;
    const pastedText = e.clipboardData.getData("text");
    e.preventDefault();

    if (pastedText.length > 100) {
      setPendingPaste(pastedText);
      setShowModal(true);
      return;
    }

    // Fix 2: Cleaned up small paste logic
    setContent((prev) => prev + pastedText);
    
    const event = {
        id: uuidv4(),
        timestamp: Date.now(),
        event_type: "paste",
        word_count: getWordCount(contentRef.current + pastedText),
        metadata: {
          length: pastedText.length,
          source: "Direct Paste",
          explanation: "Small snippet",
          ai_declared: false,
        },
    };
    setEvents((prev) => [...prev, event]);
  };

  const confirmPaste = () => {
    const event = {
      id: uuidv4(),
      timestamp: Date.now(),
      event_type: "paste",
      word_count: getWordCount(contentRef.current + pendingPaste),
      metadata: {
        length: pendingPaste.length,
        source,
        explanation,
        ai_declared: isAI,
      },
    };

    setEvents((prev) => [...prev, event]);
    setContent((prev) => prev + pendingPaste);

    setShowModal(false);
    setPendingPaste(null);
    setSource("");
    setExplanation("");
    setIsAI(false);
  };

  // Snapshot system
  useEffect(() => {
    if (isReplaying) return;

    const interval = setInterval(() => {
      const latestContent = contentRef.current;
      
      setSnapshots((prev) => {
        // Only save if content has actually changed since the last snapshot
        if (
          prev.length > 0 &&
          prev[prev.length - 1].content === latestContent
        ) {
          return prev;
        }

        // Fix 3: Ensure we don't snapshot empty content if the user hasn't typed
        if (!latestContent && prev.length === 0) return prev;

        return [
          ...prev,
          {
            timestamp: Date.now(),
            content: latestContent,
          },
        ];
      });
    }, 10000); // 10 second interval

    return () => clearInterval(interval);
  }, [isReplaying]);

  return (
    <>
      <textarea
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        disabled={isReplaying}
        className="w-full h-96 border rounded p-2"
        placeholder="Start typing here..."
      />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Large Paste Detected</h2>
            <input
              type="text"
              placeholder="Source (URL, Book, Notes...)"
              className="w-full border p-2 mb-3"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
            <textarea
              placeholder="Why are you using this content?"
              className="w-full border p-2 mb-3"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />
            <label className="flex items-center mb-3">
              <input
                type="checkbox"
                checked={isAI}
                onChange={() => setIsAI(!isAI)}
                className="mr-2"
              />
              AI Generated
            </label>
            <button
              onClick={confirmPaste}
              className="w-full bg-black text-white py-2 rounded"
            >
              Confirm & Insert
            </button>
          </div>
        </div>
      )}
    </>
  );
}