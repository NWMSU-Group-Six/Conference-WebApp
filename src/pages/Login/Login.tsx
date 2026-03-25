import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/firebase/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Enter your email and password."); return; }
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      if (["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found"].includes(err.code)) {
        setError("Invalid email or password.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Green header strip */}
        <div className="bg-[#006a4e] px-8 py-6">
          
          <h1 className="text-xl font-bold text-white">Sign in to your account</h1>
        </div>

        {/* Form body */}
        <div className="px-8 py-8">
          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                {error}
              </p>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email" type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
                className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e] focus:border-transparent transition"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password" type="password" placeholder="Enter your password"
                value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
                className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e] focus:border-transparent transition"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full h-11 bg-[#006a4e] hover:bg-[#00543d] text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-[#006a4e] font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

