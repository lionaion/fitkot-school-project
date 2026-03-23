import Link from "next/link";
import { Dumbbell, Users, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-off-white">
      <div className="max-w-2xl text-center space-y-8">
        <div>
          <h1 className="text-5xl font-bold font-display text-deep-teal">
            FitKot
          </h1>
          <p className="text-sm font-mono text-coral mt-2">DEMO MODUS</p>
        </div>
        <p className="text-xl text-gray-600">
          Train in je kot. Geen materiaal nodig, geen excuses.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
            <Dumbbell className="w-8 h-8 text-electric-teal mx-auto" />
            <h3 className="font-heading font-semibold text-lg">Workouts</h3>
            <p className="text-sm text-gray-500">
              Trainingsplannen op maat voor kleine ruimtes.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
            <Users className="w-8 h-8 text-warm-lime mx-auto" />
            <h3 className="font-heading font-semibold text-lg">Coaching</h3>
            <p className="text-sm text-gray-500">
              Persoonlijke begeleiding van je trainer.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
            <ShieldCheck className="w-8 h-8 text-coral mx-auto" />
            <h3 className="font-heading font-semibold text-lg">Voortgang</h3>
            <p className="text-sm text-gray-500">
              Volg je progressie met foto&apos;s en statistieken.
            </p>
          </div>
        </div>

        {/* Demo role selection */}
        <div className="space-y-4 mt-8">
          <p className="text-sm font-mono text-gray-500 uppercase tracking-wider">Kies een rol om te verkennen</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-3 bg-deep-teal text-white rounded-xl font-heading font-semibold text-lg hover:bg-electric-teal transition-colors min-h-[44px]"
            >
              <Dumbbell className="w-5 h-5 mr-2" />
              Student (User)
            </Link>
            <Link
              href="/trainer-dashboard"
              className="inline-flex items-center justify-center px-8 py-3 bg-electric-teal text-white rounded-xl font-heading font-semibold text-lg hover:bg-deep-teal transition-colors min-h-[44px]"
            >
              <Users className="w-5 h-5 mr-2" />
              Trainer
            </Link>
            <Link
              href="/admin-users"
              className="inline-flex items-center justify-center px-8 py-3 bg-coral text-white rounded-xl font-heading font-semibold text-lg hover:bg-coral/80 transition-colors min-h-[44px]"
            >
              <ShieldCheck className="w-5 h-5 mr-2" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
