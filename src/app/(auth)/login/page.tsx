"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // DEMO MODE: Skip auth, go straight to dashboard
    await new Promise((r) => setTimeout(r, 400));
    router.push("/dashboard");
  }

  function handleOAuthLogin() {
    // DEMO MODE: Skip OAuth, go straight to dashboard
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-off-white">
      <Card className="w-full max-w-md space-y-6" padding="lg">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-deep-teal">
            Welkom terug
          </h1>
          <p className="text-gray-500 mt-2">Log in bij FitKot</p>
          <p className="text-xs font-mono text-coral mt-1">DEMO — Login wordt overgeslagen</p>
        </div>

        <div className="space-y-3">
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleOAuthLogin}
          >
            Inloggen met Google
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleOAuthLogin}
          >
            Inloggen met GitHub
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400">of</span>
          </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <Input
            id="email"
            label="E-mail"
            type="email"
            placeholder="jan@student.be"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label="Wachtwoord"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Bezig met inloggen..." : "Inloggen"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Nog geen account?{" "}
          <Link href="/register" className="text-electric-teal hover:underline">
            Registreren
          </Link>
        </p>
      </Card>
    </main>
  );
}
