"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // DEMO MODE: Skip registration, go straight to dashboard
    await new Promise((r) => setTimeout(r, 400));
    router.push("/dashboard");
  }

  function handleOAuthRegister() {
    // DEMO MODE: Skip OAuth, go straight to dashboard
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-off-white">
      <Card className="w-full max-w-md space-y-6" padding="lg">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-deep-teal">
            Account aanmaken
          </h1>
          <p className="text-gray-500 mt-2">Start je FitKot journey</p>
          <p className="text-xs font-mono text-coral mt-1">DEMO — Registratie wordt overgeslagen</p>
        </div>

        <div className="space-y-3">
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleOAuthRegister}
          >
            Registreren met Google
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleOAuthRegister}
          >
            Registreren met GitHub
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

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            id="name"
            label="Naam"
            type="text"
            placeholder="Jan Janssen"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            placeholder="Min. 8 tekens"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Bezig met registreren..." : "Registreren"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Al een account?{" "}
          <Link href="/login" className="text-electric-teal hover:underline">
            Inloggen
          </Link>
        </p>
      </Card>
    </main>
  );
}
