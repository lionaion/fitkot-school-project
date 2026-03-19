"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  Home,
  Dumbbell,
  Camera,
  UtensilsCrossed,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types/database";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home, roles: ["user"] },
  { label: "Workouts", href: "/workouts", icon: Dumbbell, roles: ["user"] },
  { label: "Voortgang", href: "/progress", icon: Camera, roles: ["user"] },
  { label: "Voeding", href: "/nutrition", icon: UtensilsCrossed, roles: ["user", "trainer"] },
  { label: "Dashboard", href: "/trainer-dashboard", icon: Home, roles: ["trainer"] },
  { label: "Cliënten", href: "/clients", icon: Users, roles: ["trainer"] },
  { label: "Plannen", href: "/plans", icon: ClipboardList, roles: ["trainer"] },
  { label: "Gebruikers", href: "/admin-users", icon: Users, roles: ["admin"] },
  { label: "Rolbeheer", href: "/admin-roles", icon: Settings, roles: ["admin"] },
  { label: "Statistieken", href: "/admin-stats", icon: Settings, roles: ["admin"] },
];

interface NavProps {
  role: UserRole;
  onSignOut: () => void;
}

export function Nav({ role, onSignOut }: NavProps) {
  const pathname = usePathname();

  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <nav className="flex flex-col h-full bg-white border-r border-gray-200 w-64 p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-deep-teal">FitKot</h2>
      </div>

      <ul className="flex-1 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px]",
                  isActive
                    ? "bg-deep-teal/10 text-deep-teal"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        onClick={onSignOut}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors min-h-[44px] w-full"
      >
        <LogOut className="w-5 h-5" />
        Uitloggen
      </button>
    </nav>
  );
}
