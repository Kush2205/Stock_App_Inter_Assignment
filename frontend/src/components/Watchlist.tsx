import { useEffect, useState } from "react";
import { authFetch } from "../api";

export default function Watchlist({ token }: { token: string }) {
  const [stocks, setStocks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const res = await authFetch("/api/stocks", { method: "GET" }, token);
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to fetch stocks");
      } else {
        setStocks(data.stocks || []);
      }
    } catch (err: any) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateSymbol = (s: string) => /^[A-Z]{1,5}$/.test(s);

  const addStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const symbol = newSymbol.trim();
    if (!validateSymbol(symbol)) {
      setError("Stock symbol must be 1-5 uppercase letters (A-Z)");
      return;
    }
    try {
      const res = await authFetch("/api/stocks", { method: "POST", body: JSON.stringify({ stockSymbol: symbol }) }, token);
      const data = await res.json();
      if (!res.ok) {
        if (data?.errorCode === "INVALID_STOCK_SYMBOL") {
          setError("Stock symbol must be 1-4 uppercase letters (A-Z)");
          return;
        }
        setError(data?.message || "Failed to add stock");
        return;
      }
      setStocks(data.stocks || []);
      setNewSymbol("");
    } catch (err: any) {
      setError(err?.message || "Network error");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📊 Your Watchlist</h2>
        <p className="text-gray-600 text-sm">Track your favorite stocks</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="mb-6">
          {stocks.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="mt-2 text-gray-500">No stocks in your watchlist yet</p>
              <p className="text-sm text-gray-400">Add your first stock below</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {stocks.map((s) => (
                <div key={s} className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg px-4 py-3 text-center shadow-sm hover:shadow-md transition">
                  <span className="font-bold text-indigo-700 text-lg">{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Stock</h3>
        <form onSubmit={addStock} className="flex flex-col sm:flex-row gap-3">
          <input 
            value={newSymbol} 
            onChange={(e) => setNewSymbol(e.target.value.toUpperCase())} 
            placeholder="Enter stock symbol (e.g., TCS, INFY)" 
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-200 whitespace-nowrap">
            ➕ Add Stock
          </button>
        </form>
        {error && <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
      </div>
    </div>
  );
}
