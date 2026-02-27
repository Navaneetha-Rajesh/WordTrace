import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Editor() {
  const [content, setContent] = useState("");
  const [events, setEvents] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [sessionStart] = useState(Date.now());

  const getWordCount = (text) => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  };

  // INSERT EVENTS
  const handleChange = (e) => {
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

  // DELETE EVENTS
  const handleKeyDown = (e) => {
    if (e.key === "Backspace") {
      const event = {
        id: uuidv4(),
        timestamp: Date.now(),
        event_type: "delete",
        word_count: getWordCount(content),
        metadata: {},
      };

      setEvents((prev) => [...prev, event]);
    }
  };

  // PASTE EVENTS
  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData("text");

    const event = {
      id: uuidv4(),
      timestamp: Date.now(),
      event_type: "paste",
      word_count: getWordCount(content),
      metadata: {
        length: pastedText.length,
      },
    };

    setEvents((prev) => [...prev, event]);
  };

  // SNAPSHOT SYSTEM (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setSnapshots((prev) => {
        // prevent duplicate snapshots
        if (
          prev.length > 0 &&
          prev[prev.length - 1].content === content
        ) {
          return prev;
        }

        return [
          ...prev,
          {
            timestamp: Date.now(),
            content: content,
          },
        ];
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [content]);

  // Debug Logs
  useEffect(() => {
    console.log("Session started at:", sessionStart);
  }, []);

  useEffect(() => {
    console.log("Events:", events);
  }, [events]);

  useEffect(() => {
    console.log("Snapshots:", snapshots);
  }, [snapshots]);

  return (
    <textarea
      value={content}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      className="w-full h-96 border rounded p-2"
      placeholder="Start typing here..."
    />
  );
}