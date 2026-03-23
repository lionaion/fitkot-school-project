"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TrainerAssignmentsProps {
  trainers: { id: string; name: string; email: string }[];
  users: { id: string; name: string; email: string }[];
  assignments: {
    id: string;
    trainer_id: string;
    client_id: string;
    users: unknown;
  }[];
}

export function TrainerAssignments({ trainers, users, assignments: initialAssignments }: TrainerAssignmentsProps) {
  // DEMO MODE: Local state management instead of Supabase
  const [assignments, setAssignments] = useState(initialAssignments);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAssign() {
    if (!selectedTrainer || !selectedClient) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    const clientUser = users.find((u) => u.id === selectedClient);
    setAssignments([
      ...assignments,
      {
        id: `demo-${Date.now()}`,
        trainer_id: selectedTrainer,
        client_id: selectedClient,
        users: { name: clientUser?.name ?? "Onbekend" },
      },
    ]);
    setLoading(false);
    setSelectedClient("");
  }

  async function handleRemove(assignmentId: string) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setAssignments(assignments.filter((a) => a.id !== assignmentId));
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-end">
        <div className="flex-1 space-y-1">
          <label className="block text-sm font-medium text-gray-700 font-mono">Trainer</label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white min-h-[44px]"
            value={selectedTrainer}
            onChange={(e) => setSelectedTrainer(e.target.value)}
          >
            <option value="">Kies trainer...</option>
            {trainers.map((t) => (
              <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
            ))}
          </select>
        </div>
        <div className="flex-1 space-y-1">
          <label className="block text-sm font-medium text-gray-700 font-mono">Cliënt</label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white min-h-[44px]"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="">Kies cliënt...</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </select>
        </div>
        <Button onClick={handleAssign} disabled={loading || !selectedTrainer || !selectedClient}>
          Toewijzen
        </Button>
      </div>

      <div>
        <h3 className="font-heading font-semibold mb-3">Huidige toewijzingen</h3>
        {assignments.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {assignments.map((a) => {
              const trainer = trainers.find((t) => t.id === a.trainer_id);
              const client = users.find((u) => u.id === a.client_id);
              const clientName = (a.users as { name: string })?.name ?? client?.name ?? "Onbekend";
              return (
                <li key={a.id} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-medium">{trainer?.name ?? "Onbekend"}</span>
                    <span className="text-gray-400 mx-2">&rarr;</span>
                    <span>{clientName}</span>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => handleRemove(a.id)}>
                    Verwijderen
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-400 text-center py-4">Geen toewijzingen.</p>
        )}
      </div>
    </div>
  );
}
