"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { apiClient } from "@/lib/apiClient";
import { useSession } from "@/lib/session";

type FormValues = { title: string; body: string };

export default function AdminAnnouncementsPage() {
  const { session } = useSession();
  const form = useForm<FormValues>({ defaultValues: { title: "", body: "" } });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      // return apiClient.post("/admin/announcements", values, session);
      await apiClient.get<{ message: string }>("/", session).catch(() => ({ message: "offline" }));
      return values;
    },
    onSuccess: () => form.reset(),
  });

  if (!session) return <div className="text-sm text-gray-600">Please sign in.</div>;
  if (session.role !== "admin")
    return <div className="text-sm text-red-700">Admin role required.</div>;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900">Post Announcement</h1>
      <p className="mt-1 text-sm text-gray-600">
        Posting will broadcast live updates over WebSocket. (Backend pending.)
      </p>

      <form
        className="mt-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <label className="block">
          <div className="text-sm font-medium text-gray-700">Title</div>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            {...form.register("title", { required: true })}
          />
        </label>

        <label className="block">
          <div className="text-sm font-medium text-gray-700">Body</div>
          <textarea
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            rows={5}
            {...form.register("body", { required: true })}
          />
        </label>

        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Posting…" : "Post"}
        </button>

        {mutation.isSuccess ? (
          <div className="text-sm text-[var(--color-success)]">
            Posted (demo).
          </div>
        ) : null}
      </form>
    </div>
  );
}
