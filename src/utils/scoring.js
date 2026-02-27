export function calculateAuthorshipScore(events) {
  if (!events || events.length === 0) return 0;

  const insertEvents = events.filter(e => e.event_type === "insert").length;
  const deleteEvents = events.filter(e => e.event_type === "delete").length;
  const pasteEvents = events.filter(e => e.event_type === "paste");

  const totalPasteLength = pasteEvents.reduce(
    (sum, e) => sum + (e.metadata?.length || 0),
    0
  );

  let score = 0;

  // Writing activity
  if (insertEvents > 20) score += 25;
  else if (insertEvents > 10) score += 15;
  else score += 5;

  // Revision depth
  if (deleteEvents > 5) score += 20;

  // Low paste dependency
  if (totalPasteLength < 500) score += 25;
  else if (totalPasteLength < 1500) score += 10;

  // Consistency bonus
  if (insertEvents > deleteEvents) score += 15;

  // Cap at 100
  return Math.min(score, 100);
}