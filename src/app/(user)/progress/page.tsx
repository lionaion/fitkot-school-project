import { Card } from "@/components/ui/card";
import { PhotoUpload } from "@/components/workout/photo-upload";

// DEMO MODE: Mock data
const mockPhotos = [
  { id: "ph1", s3_url: "", uploaded_at: "2026-03-20T10:00:00Z" },
  { id: "ph2", s3_url: "", uploaded_at: "2026-03-13T09:30:00Z" },
  { id: "ph3", s3_url: "", uploaded_at: "2026-03-06T11:00:00Z" },
  { id: "ph4", s3_url: "", uploaded_at: "2026-02-27T08:45:00Z" },
];

const mockNotes = [
  { id: "n1", text: "Push-ups gaan veel makkelijker nu, kan er 20 in een set doen!", created_at: "2026-03-22T14:00:00Z" },
  { id: "n2", text: "Eerste keer 1 minuut plank volgehouden. Trots!", created_at: "2026-03-18T16:30:00Z" },
  { id: "n3", text: "Benen zijn stijf na gisteren, maar het wordt elke week beter.", created_at: "2026-03-14T10:00:00Z" },
];

export default function ProgressPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-deep-teal">Voortgang</h1>
        <p className="text-gray-500 mt-1">Volg je progressie met foto&apos;s en notities.</p>
      </div>

      {/* Photo upload */}
      <Card>
        <h2 className="text-xl font-heading font-semibold mb-4">Foto uploaden</h2>
        <PhotoUpload />
      </Card>

      {/* Photo gallery */}
      <section>
        <h2 className="text-xl font-heading font-semibold mb-4">Foto&apos;s</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockPhotos.map((photo) => (
            <Card key={photo.id} padding="sm" className="overflow-hidden">
              <div className="w-full h-48 bg-gradient-to-br from-electric-teal/20 to-warm-lime/20 rounded-xl flex items-center justify-center">
                <span className="text-4xl">📸</span>
              </div>
              <p className="text-xs text-gray-400 mt-2 font-mono">
                {new Date(photo.uploaded_at).toLocaleDateString("nl-BE")}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Notes */}
      <section>
        <h2 className="text-xl font-heading font-semibold mb-4">Notities</h2>
        <Card>
          <ul className="divide-y divide-gray-100">
            {mockNotes.map((note) => (
              <li key={note.id} className="py-3">
                <p className="text-sm">{note.text}</p>
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  {new Date(note.created_at).toLocaleDateString("nl-BE")}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
