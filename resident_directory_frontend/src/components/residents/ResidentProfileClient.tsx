"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useSession } from "@/lib/session";

type Resident = {
  id: string;
  displayName: string;
  unit?: string;
  bio?: string | null;
  email?: string | null;
  phone?: string | null;
};

export default function ResidentProfileClient({ id }: { id: string }) {
  const { session } = useSession();

  const residentQuery = useQuery({
    queryKey: ["resident", id],
    queryFn: async (): Promise<Resident> => {
      // return apiClient.get<Resident>(`/residents/${id}`, session);
      await apiClient
        .get<{ message: string }>("/", session)
        .catch(() => ({ message: "offline" }));
      return {
        id: String(id),
        displayName: `Resident #${id}`,
        unit: "Unit —",
        bio: "This is a demo resident profile until backend endpoints are implemented.",
        email: null,
        phone: null,
      };
    },
  });

  if (residentQuery.isLoading) {
    return <div className="text-sm text-gray-600">Loading…</div>;
  }
  if (residentQuery.isError || !residentQuery.data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-5 text-sm text-red-700">
        Failed to load resident profile.
      </div>
    );
  }

  const r = residentQuery.data;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">{r.displayName}</h1>
        <p className="mt-1 text-sm text-gray-600">{r.unit ?? "—"}</p>

        {r.bio ? <p className="mt-4 text-gray-800">{r.bio}</p> : null}

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="text-xs font-semibold text-gray-600">Email</div>
            <div className="mt-1 text-sm text-gray-900">{r.email ?? "Hidden"}</div>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="text-xs font-semibold text-gray-600">Phone</div>
            <div className="mt-1 text-sm text-gray-900">{r.phone ?? "Hidden"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
