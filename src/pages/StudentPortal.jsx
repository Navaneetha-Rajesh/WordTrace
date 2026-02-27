import Editor from "../components/Editor";

export default function StudentPortal() {
  return (
    <div className="h-screen flex flex-col">
      
      {/* Main Section */}
      <div className="flex flex-1">
        
        {/* LEFT PANEL - Analytics */}
        <div className="w-1/3 border-r p-4 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Analytics Panel</h2>
          <div className="mb-4">Confidence Meter</div>
          <div className="mb-4">Integrity Badge</div>
          <div className="mb-4">Score Breakdown</div>
          <div>AI Transparency Log</div>
        </div>

        {/* RIGHT PANEL - Editor */}
        <div className="w-2/3 p-4">
          <h2 className="text-xl font-semibold mb-4">Editor</h2>
          <Editor />
        </div>

      </div>

      {/* Bottom Section - Replay */}
      <div className="border-t p-4 bg-white">
        <h2 className="text-lg font-semibold mb-2">Timeline Replay</h2>
        <input type="range" className="w-full" />
      </div>

    </div>
  );
}