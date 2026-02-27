import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Editor({
  content,
  setContent,
  events,
  setEvents,
  snapshots,
  setSnapshots,
  isReplaying,
}) {
  const contentRef = useRef(content);

  // Keep ref updated with latest content
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

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

    const event = {
      id: uuidv4(),
      timestamp: Date.now(),
      event_type: "paste",
      word_count: getWordCount(contentRef.current),
      metadata: {
        length: pastedText.length,
      },
    };

    setEvents((prev) => [...prev, event]);
  };

  // Stable Snapshot System
  useEffect(() => {
    if (isReplaying) return;

    const interval = setInterval(() => {
      setSnapshots((prev) => {
        const latestContent = contentRef.current;

        if (
          prev.length > 0 &&
          prev[prev.length - 1].content === latestContent
        ) {
          return prev;
        }

        const updated = [
          ...prev,
          {
            timestamp: Date.now(),
            content: latestContent,
          },
        ];

        console.log("Snapshot added:", updated);
        return updated;
      });
    }, 30000); // 10 seconds for testing

    return () => clearInterval(interval);
  }, [isReplaying]);

  return (
    <textarea
      value={content}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      disabled={isReplaying}
      className="w-full h-96 border rounded p-2"
      placeholder="Start typing here..."
    />
  );
}