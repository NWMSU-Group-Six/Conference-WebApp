import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="min-h-screen flex">
      {/* Image panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="/images/union-fall2017-ch-006-bw.webp"
          alt="Northwest Missouri State University"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#003d2a]/75" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <img src="/images/N-Horiz-Full.png" alt="NWMSU" className="h-10 w-auto brightness-0 invert mb-8" />
          <h2 className="text-4xl font-bold leading-tight mb-3">
            Northwest<br />Conference 2026
          </h2>
          <p className="text-white/70 text-base max-w-sm">
            Advancing knowledge at Northwest Missouri State University.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16 bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-gray-500 text-sm">Sign in to your conference account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email" type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
                className="h-11 border-gray-300 focus-visible:ring-[#006a4e]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password" type="password" placeholder="Password"
                value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
                className="h-11 border-gray-300 focus-visible:ring-[#006a4e]"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full h-11 bg-[#006a4e] hover:bg-[#00543d] text-white font-semibold rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-[#006a4e] font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("Invalid email or password.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6 bg-white shadow-xl rounded-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-semibold tracking-tight text-center border-b-2 border-green-700 pb-3">
            Sign In
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Welcome back to Northwest Conference 2026
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#006a4e] hover:bg-[#00543d] text-white"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-[#006a4e] font-medium hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

