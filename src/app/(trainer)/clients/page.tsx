import Link from "next/link";
import { Card } from "@/components/ui/card";

// DEMO MODE: Mock data
const mockClients = [
  { id: "c1", name: "Stan De Vries", email: "stan@student.be", status: "active" },
  { id: "c2", name: "Emma Peeters", email: "emma@student.be", status: "active" },
  { id: "c3", name: "Liam Janssens", email: "liam@student.be", status: "active" },
  { id: "c4", name: "Julie Maes", email: "julie@student.be", status: "active" },
  { id: "c5", name: "Noah Willems", email: "noah@student.be", status: "active" },
];

export default function ClientsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-deep-teal">Cliënten</h1>
        <p className="text-gray-500 mt-1">Beheer je cliënten en bekijk hun voortgang.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockClients.map((client) => (
          <Link key={client.id} href={`/clients/${client.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-electric-teal/10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-electric-teal">
                    {client.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-heading font-semibold">{client.name}</p>
                  <p className="text-sm text-gray-500">{client.email}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
