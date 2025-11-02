import { useState } from "react";
import ConnectionStatus from "./ConnectionStatus";

const LandingPage = ({ onGetStarted, isConnected }) => {
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomId.trim() && userName.trim()) {
      onGetStarted(roomId.trim(), userName.trim());
    }
  };

  const generateRoomId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  if (showJoinForm) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-500 via-green-500 to-teal-500 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-fadeIn">
          <div className="absolute top-4 right-4">
            <ConnectionStatus isConnected={isConnected} />
          </div>
          <button
            onClick={() => setShowJoinForm(false)}
            className="text-gray-500 hover:text-gray-700 mb-4"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Join a Room</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRoomId(generateRoomId())}
                className="flex-1 p-3 bg-gray-200 text-gray-700 rounded-lg text-base hover:bg-gray-300 transition-colors"
              >
                Generate ID
              </button>
              <button
                type="submit"
                disabled={!isConnected}
                className={`flex-1 p-3 text-white rounded-lg text-base font-semibold transition-colors ${
                  isConnected
                    ? "bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isConnected ? "Join" : "Connecting..."}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-500 via-green-500 to-teal-500 overflow-y-auto">
      <div className="fixed top-4 right-4 z-50">
        <ConnectionStatus isConnected={isConnected} />
      </div>

      <div className="container mx-auto px-4 pt-20 pb-24">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fadeIn">
            Code Together, <span className="text-lime-300">In Real-Time</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100 animate-fadeIn">
            Collaborate on code with your team instantly. No setup required.
          </p>
          <button
            onClick={() => setShowJoinForm(true)}
            disabled={!isConnected}
            className={`px-8 py-4 text-lg font-semibold rounded-full shadow-lg transition-all hover:shadow-2xl ${
              isConnected
                ? "bg-white text-green-600 hover:bg-lime-300 hover:text-green-700 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isConnected ? "Get Started" : "Connecting..."}
          </button>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white hover:bg-white/20 transition-all transform">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3">Real-Time Sync</h3>
            <p className="text-green-100">
              See changes instantly as your teammates type. No lag, no delays.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white hover:bg-white/20 transition-all transform">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-3">Multiple Languages</h3>
            <p className="text-green-100">
              Support for JavaScript, Python, Java, C++, and many more
              languages.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white hover:bg-white/20 transition-all transform">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-xl font-bold mb-3">Run Code Instantly</h3>
            <p className="text-green-100">
              Execute your code and see results immediately. Perfect for
              learning and testing.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20 max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-bold text-lime-300 mb-3">1</div>
              <h4 className="text-lg font-semibold mb-2">Create or Join</h4>
              <p className="text-green-100">
                Start a new room or join an existing one with a room ID.
              </p>
            </div>
            <div>
              <div className="text-5xl font-bold text-lime-300 mb-3">2</div>
              <h4 className="text-lg font-semibold mb-2">Code Together</h4>
              <p className="text-green-100">
                Write code collaboratively with real-time cursor tracking.
              </p>
            </div>
            <div>
              <div className="text-5xl font-bold text-lime-300 mb-3">3</div>
              <h4 className="text-lg font-semibold mb-2">Run & Share</h4>
              <p className="text-green-100">
                Execute code and share results with your team instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full text-center text-white/70 py-8 mt-16">
        <p>Built with ❤️ for developers</p>
      </div>
    </div>
  );
};

export default LandingPage;
