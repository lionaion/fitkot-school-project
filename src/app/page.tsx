import Link from "next/link";
import { Dumbbell, Users, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-bold font-display text-deep-teal">
          FitKot
        </h1>
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

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3 bg-deep-teal text-white rounded-xl font-heading font-semibold text-lg hover:bg-electric-teal transition-colors min-h-[44px]"
          >
            Inloggen
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-deep-teal text-deep-teal rounded-xl font-heading font-semibold text-lg hover:bg-deep-teal hover:text-white transition-colors min-h-[44px]"
          >
            Registreren
          </Link>
        </div>
      </div>
    </main>
  );
}
