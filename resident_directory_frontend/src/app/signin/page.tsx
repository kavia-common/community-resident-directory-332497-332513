"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useSession();

  const [email, setEmail] = React.useState("admin@example.com");
  const [role, setRole] = React.useState<"resident" | "admin">("admin");

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>
      <p className="mt-2 text-sm text-gray-600">
        Demo sign-in. Until the backend implements auth endpoints, this stores a
        session locally.
      </p>

      <div className="mt-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <label className="block">
          <div className="text-sm font-medium text-gray-700">Email</div>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label className="block">
          <div className="text-sm font-medium text-gray-700">Role</div>
          <select
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            value={role}
            onChange={(e) => {
              const next = e.target.value;
              setRole(next === "resident" ? "resident" : "admin");
            }}
          >
            <option value="resident">Resident</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <button
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => {
            signIn({ token: "demo-token", email, role });
            router.push("/directory");
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
