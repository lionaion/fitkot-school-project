import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { PhotoUpload } from "@/components/workout/photo-upload";

export default async function ProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: photos } = await supabase
    .from("progress_photos")
    .select("*")
    .eq("user_id", user!.id)
    .order("uploaded_at", { ascending: false });

  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(10);

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
        {photos && photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <Card key={photo.id} padding="sm" className="overflow-hidden">
                <img
                  src={photo.s3_url}
                  alt="Voortgangsfoto"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <p className="text-xs text-gray-400 mt-2 font-mono">
                  {new Date(photo.uploaded_at).toLocaleDateString("nl-BE")}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-gray-400 text-center py-8">
              Nog geen foto&apos;s. Upload je eerste voortgangsfoto!
            </p>
          </Card>
        )}
      </section>

      {/* Notes */}
      <section>
        <h2 className="text-xl font-heading font-semibold mb-4">Notities</h2>
        {notes && notes.length > 0 ? (
          <Card>
            <ul className="divide-y divide-gray-100">
              {notes.map((note) => (
                <li key={note.id} className="py-3">
                  <p className="text-sm">{note.text}</p>
                  <p className="text-xs text-gray-400 mt-1 font-mono">
                    {new Date(note.created_at).toLocaleDateString("nl-BE")}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <Card>
            <p className="text-gray-400 text-center py-8">
              Nog geen notities.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
