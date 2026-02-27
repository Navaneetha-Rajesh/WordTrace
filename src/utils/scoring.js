export function calculateAuthorshipScore(events) {
  if (!events || events.length === 0) {
    return {
      score: 0,
      breakdown: {
        writing: 0,
        revision: 0,
        pastePenalty: 0,
        consistency: 0,
      },
    };
  }

  const insertEvents = events.filter(e => e.event_type === "insert").length;
  const deleteEvents = events.filter(e => e.event_type === "delete").length;
  const pasteEvents = events.filter(e => e.event_type === "paste");

  const totalPasteLength = pasteEvents.reduce(
    (sum, e) => sum + (e.metadata?.length || 0),
    0
  );

  let writing = 0;
  let revision = 0;
  let pastePenalty = 0;
  let consistency = 0;

  if (insertEvents > 20) writing = 25;
  else if (insertEvents > 10) writing = 15;
  else writing = 5;

  if (deleteEvents > 5) revision = 20;

  if (totalPasteLength < 500) pastePenalty = 25;
  else if (totalPasteLength < 1500) pastePenalty = 10;
  else pastePenalty = 0;

  if (insertEvents > deleteEvents) consistency = 15;

  const total = Math.min(writing + revision + pastePenalty + consistency, 100);

  return {
    score: total,
    breakdown: {
      writing,
      revision,
      pastePenalty,
      consistency,
    },
  };
}