import { Card } from "@/components/ui/card";
import { TrainerAssignments } from "@/components/admin/trainer-assignments";

// DEMO MODE: Mock data
const mockTrainers = [
  { id: "u3", name: "Sofia Martens", email: "sofia@trainer.be" },
  { id: "u7", name: "Jan Claes", email: "jan@trainer.be" },
];

const mockUsers = [
  { id: "u1", name: "Stan De Vries", email: "stan@student.be" },
  { id: "u2", name: "Emma Peeters", email: "emma@student.be" },
  { id: "u4", name: "Liam Janssens", email: "liam@student.be" },
  { id: "u5", name: "Julie Maes", email: "julie@student.be" },
  { id: "u6", name: "Noah Willems", email: "noah@student.be" },
];

const mockAssignments = [
  { id: "a1", trainer_id: "u3", client_id: "u1", users: { name: "Stan De Vries" } },
  { id: "a2", trainer_id: "u3", client_id: "u2", users: { name: "Emma Peeters" } },
  { id: "a3", trainer_id: "u3", client_id: "u4", users: { name: "Liam Janssens" } },
  { id: "a4", trainer_id: "u7", client_id: "u5", users: { name: "Julie Maes" } },
  { id: "a5", trainer_id: "u7", client_id: "u6", users: { name: "Noah Willems" } },
];

export default function RolesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-deep-teal">Rolbeheer</h1>
        <p className="text-gray-500 mt-1">Wijs trainers toe aan cliënten.</p>
      </div>

      <Card>
        <TrainerAssignments
          trainers={mockTrainers}
          users={mockUsers}
          assignments={mockAssignments}
        />
      </Card>
    </div>
  );
}
