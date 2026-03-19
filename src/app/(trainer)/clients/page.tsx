import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: clients } = await supabase
    .from("trainer_clients")
    .select("client_id, users!trainer_clients_client_id_fkey(id, name, email, avatar_url, status)")
    .eq("trainer_id", user!.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-deep-teal">Cliënten</h1>
        <p className="text-gray-500 mt-1">Beheer je cliënten en bekijk hun voortgang.</p>
      </div>

      {clients && clients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((c) => {
            const client = c.users as unknown as {
              id: string;
              name: string;
              email: string;
              avatar_url: string | null;
              status: string;
            };
            return (
              <Link key={client.id} href={`/clients/${client.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-electric-teal/10 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-electric-teal">
                        {client.name?.charAt(0)?.toUpperCase() ?? "?"}
                      </span>
                    </div>
                    <div>
                      <p className="font-heading font-semibold">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card>
          <p className="text-gray-400 text-center py-8">
            Nog geen cliënten toegewezen. Een admin kan cliënten aan je koppelen.
          </p>
        </Card>
      )}
    </div>
  );
}
