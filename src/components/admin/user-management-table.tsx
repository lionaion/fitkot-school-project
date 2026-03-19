"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { UserRole, UserStatus } from "@/types/database";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

interface UserManagementTableProps {
  users: User[];
}

export function UserManagementTable({ users }: UserManagementTableProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState<string | null>(null);

  async function updateRole(userId: string, newRole: UserRole) {
    setLoading(userId);
    await supabase.from("users").update({ role: newRole }).eq("id", userId);
    setLoading(null);
    router.refresh();
  }

  async function updateStatus(userId: string, newStatus: UserStatus) {
    setLoading(userId);
    await supabase.from("users").update({ status: newStatus }).eq("id", userId);
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 px-4 text-sm font-mono font-medium text-gray-500">Naam</th>
            <th className="py-3 px-4 text-sm font-mono font-medium text-gray-500">E-mail</th>
            <th className="py-3 px-4 text-sm font-mono font-medium text-gray-500">Rol</th>
            <th className="py-3 px-4 text-sm font-mono font-medium text-gray-500">Status</th>
            <th className="py-3 px-4 text-sm font-mono font-medium text-gray-500">Acties</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-100">
              <td className="py-3 px-4 font-medium">{user.name}</td>
              <td className="py-3 px-4 text-sm text-gray-500">{user.email}</td>
              <td className="py-3 px-4">
                <select
                  className="px-2 py-1 text-sm rounded-lg border border-gray-200 bg-white"
                  value={user.role}
                  onChange={(e) => updateRole(user.id, e.target.value as UserRole)}
                  disabled={loading === user.id}
                >
                  <option value="user">User</option>
                  <option value="trainer">Trainer</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    user.status === "active"
                      ? "bg-warm-lime/20 text-green-700"
                      : user.status === "suspended"
                        ? "bg-coral/10 text-coral"
                        : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="py-3 px-4">
                {user.status === "active" ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => updateStatus(user.id, "suspended")}
                    disabled={loading === user.id}
                  >
                    Blokkeren
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => updateStatus(user.id, "active")}
                    disabled={loading === user.id}
                  >
                    Activeren
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <p className="text-gray-400 text-center py-8">Geen gebruikers gevonden.</p>
      )}
    </div>
  );
}
