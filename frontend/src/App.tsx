import { useEffect, useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Watchlist from "./components/Watchlist";

type Page = "login" | "signup" | "watchlist";

function App() {
  const [page, setPage] = useState<Page>("login");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      setToken(t);
      setPage("watchlist");
    }
  }, []);

  const handleLogin = (t: string) => {
    localStorage.setItem("token", t);
    setToken(t);
    setPage("watchlist");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setPage("login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-2">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Stock Watchlist</h1>
                <p className="text-xs text-gray-500">Track your investments</p>
              </div>
            </div>
            <nav className="flex gap-2">
              {!token ? (
                <>
                  <button 
                    onClick={() => setPage("login")} 
                    className={`px-4 py-2 rounded-lg font-medium transition ${page === "login" ? "bg-blue-500 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setPage("signup")} 
                    className={`px-4 py-2 rounded-lg font-medium transition ${page === "signup" ? "bg-green-500 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setPage("watchlist")} 
                    className={`px-4 py-2 rounded-lg font-medium transition ${page === "watchlist" ? "bg-indigo-500 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    📊 Watchlist
                  </button>
                  <button 
                    onClick={handleLogout} 
                    className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {page === "login" && <Login onLogin={handleLogin} />}
          {page === "signup" && <Signup onSignup={handleLogin} />}
          {page === "watchlist" && token && <Watchlist token={token} />}
        </div>
      </main>

      <footer className="mt-12 py-6 text-center text-gray-500 text-sm border-t bg-white">
        <p>© 2025 Stock Watchlist. Built with ❤️ for investors.</p>
      </footer>
    </div>
  );
}

export default App;
