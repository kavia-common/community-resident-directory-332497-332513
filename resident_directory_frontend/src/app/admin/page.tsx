"use client";

import Link from "next/link";
import React from "react";
import { useSession } from "@/lib/session";

export default function AdminPage() {
  const { session } = useSession();

  if (!session) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">Admin</h1>
        <p className="mt-2 text-sm text-gray-600">
          Please sign in to access admin tools.
        </p>
        <Link className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white" href="/signin">
          Sign in
        </Link>
      </div>
    );
  }

  if (session.role !== "admin") {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-700 shadow-sm">
        Access denied: admin role required.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Admin Panel</h1>
      <p className="mt-1 text-sm text-gray-600">
        Manage residents, invitations, and announcements.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <Link
          href="/admin/residents"
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-blue-300"
        >
          <div className="text-base font-semibold text-gray-900">Resident management</div>
          <div className="mt-1 text-sm text-gray-600">Create/update residents, roles, privacy.</div>
        </Link>

        <Link
          href="/admin/announcements"
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-blue-300"
        >
          <div className="text-base font-semibold text-gray-900">Announcements</div>
          <div className="mt-1 text-sm text-gray-600">Post announcements to the community.</div>
        </Link>
      </div>
    </div>
  );
}
