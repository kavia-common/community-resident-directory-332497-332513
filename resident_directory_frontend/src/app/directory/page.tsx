"use client";

import Link from "next/link";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useSession } from "@/lib/session";

type Resident = {
  id: string;
  displayName: string;
  unit?: string;
  photoUrl?: string | null;
  // privacy-aware fields (backend will enforce)
  email?: string | null;
  phone?: string | null;
};

const demoResidents: Resident[] = [
  { id: "1", displayName: "Alex Johnson", unit: "Unit 203" },
  { id: "2", displayName: "Priya Singh", unit: "Unit 118" },
  { id: "3", displayName: "Miguel Rivera", unit: "Unit 507" },
];

export default function DirectoryPage() {
  const { session } = useSession();
  const [q, setQ] = React.useState("");
  const [unit, setUnit] = React.useState("");

  const residentsQuery = useQuery({
    queryKey: ["residents", { q, unit }],
    queryFn: async (): Promise<Resident[]> => {
      // Backend currently only exposes "/" health check; keep endpoint wiring ready:
      // return apiClient.get<Resident[]>(`/residents?q=${encodeURIComponent(q)}&unit=${encodeURIComponent(unit)}`, session);
      await apiClient.get<{ message: string }>("/", session).catch(() => ({ message: "offline" }));
      return demoResidents;
    },
  });

  const filtered = (residentsQuery.data ?? []).filter((r) => {
    const okQ = q ? r.displayName.toLowerCase().includes(q.toLowerCase()) : true;
    const okUnit = unit ? (r.unit ?? "").toLowerCase().includes(unit.toLowerCase()) : true;
    return okQ && okUnit;
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Directory</h1>
          <p className="mt-1 text-sm text-gray-600">
            Search and filter residents. Fields shown depend on privacy settings.
          </p>
        </div>

        <Link
          href="/me"
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
        >
          Edit my profile
        </Link>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-2">
        <label className="block">
          <div className="text-sm font-medium text-gray-700">Search</div>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="Name…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <label className="block">
          <div className="text-sm font-medium text-gray-700">Unit / Address</div>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="Unit 203…"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </label>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {filtered.map((r) => (
          <Link
            key={r.id}
            href={`/residents/${r.id}`}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-blue-300"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-gray-900">{r.displayName}</div>
                <div className="mt-1 text-sm text-gray-600">{r.unit ?? "—"}</div>
              </div>
              <div className="text-sm text-blue-700">View</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
