"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useSession } from "@/lib/session";

type ResidentAdminRow = { id: string; displayName: string; unit: string; role: "resident" | "admin" };

export default function AdminResidentsPage() {
  const { session } = useSession();

  const query = useQuery({
    queryKey: ["admin", "residents"],
    queryFn: async (): Promise<ResidentAdminRow[]> => {
      // return apiClient.get<ResidentAdminRow[]>("/admin/residents", session);
      await apiClient.get<{ message: string }>("/", session).catch(() => ({ message: "offline" }));
      return [
        { id: "1", displayName: "Alex Johnson", unit: "Unit 203", role: "resident" },
        { id: "2", displayName: "Priya Singh", unit: "Unit 118", role: "resident" },
      ];
    },
    enabled: !!session,
  });

  if (!session) return <div className="text-sm text-gray-600">Please sign in.</div>;
  if (session.role !== "admin")
    return <div className="text-sm text-red-700">Admin role required.</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Resident Management</h1>
      <p className="mt-1 text-sm text-gray-600">
        Add/edit residents. (Demo UI; backend endpoints pending.)
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {(query.data ?? []).map((r) => (
              <tr key={r.id} className="border-t border-gray-200">
                <td className="px-4 py-3 font-medium text-gray-900">{r.displayName}</td>
                <td className="px-4 py-3 text-gray-700">{r.unit}</td>
                <td className="px-4 py-3 text-gray-700">{r.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
