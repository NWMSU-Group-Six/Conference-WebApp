import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signup, login } from "@/firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Enter your email and password");
      return;
    }

    try {
      await login(email, password);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.href = "/";
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

// sign in

 const handlesignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Enter a valid email and password");
      return;
    }

    try {
      await signup(email, password);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.href = "/";
    } catch (err) {
      setError("Sign-up failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/convert.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-white/10"></div>

      <Card className="w-full max-w-md p-6 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-semibold tracking-tight text-center border-b-2 border-green-700 pb-2">
            Conference Login
          </CardTitle>
          <CardDescription className="text-center"></CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
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
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={handleLogin}
            >
              Sign up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

