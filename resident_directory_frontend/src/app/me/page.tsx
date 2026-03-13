"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useSession } from "@/lib/session";

const schema = z.object({
  displayName: z.string().min(1, "Name is required"),
  unit: z.string().min(1, "Unit/address is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  privacyEmail: z.enum(["public", "residents", "private"]),
  privacyPhone: z.enum(["public", "residents", "private"]),
});

type FormValues = z.infer<typeof schema>;

export default function MyProfilePage() {
  const { session } = useSession();

  const profileQuery = useQuery({
    queryKey: ["me"],
    queryFn: async (): Promise<FormValues> => {
      // return apiClient.get<FormValues>("/me", session);
      await apiClient.get<{ message: string }>("/", session).catch(() => ({ message: "offline" }));
      return {
        displayName: "Admin User",
        unit: "Unit 000",
        email: session?.email ?? "admin@example.com",
        phone: "",
        bio: "",
        privacyEmail: "residents",
        privacyPhone: "private",
      };
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      // return apiClient.put("/me", values, session);
      await apiClient.get<{ message: string }>("/", session).catch(() => ({ message: "offline" }));
      return values;
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: profileQuery.data,
  });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
      <p className="mt-1 text-sm text-gray-600">
        Update your profile and privacy settings.
      </p>

      <form
        className="mt-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <div className="text-sm font-medium text-gray-700">Name</div>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              {...form.register("displayName")}
            />
            {form.formState.errors.displayName ? (
              <div className="mt-1 text-xs text-red-700">
                {form.formState.errors.displayName.message}
              </div>
            ) : null}
          </label>

          <label className="block">
            <div className="text-sm font-medium text-gray-700">Unit / Address</div>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              {...form.register("unit")}
            />
            {form.formState.errors.unit ? (
              <div className="mt-1 text-xs text-red-700">
                {form.formState.errors.unit.message}
              </div>
            ) : null}
          </label>
        </div>

        <label className="block">
          <div className="text-sm font-medium text-gray-700">Bio</div>
          <textarea
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            rows={4}
            {...form.register("bio")}
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <div className="text-sm font-medium text-gray-700">Email (optional)</div>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              {...form.register("email")}
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium text-gray-700">Phone (optional)</div>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              {...form.register("phone")}
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <div className="text-sm font-medium text-gray-700">Email visibility</div>
            <select
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              {...form.register("privacyEmail")}
            >
              <option value="public">Public</option>
              <option value="residents">Residents only</option>
              <option value="private">Private</option>
            </select>
          </label>

          <label className="block">
            <div className="text-sm font-medium text-gray-700">Phone visibility</div>
            <select
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              {...form.register("privacyPhone")}
            >
              <option value="public">Public</option>
              <option value="residents">Residents only</option>
              <option value="private">Private</option>
            </select>
          </label>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            type="submit"
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? "Saving…" : "Save changes"}
          </button>

          {saveMutation.isSuccess ? (
            <div className="text-sm text-[var(--color-success)]">
              Saved (demo).
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
}
