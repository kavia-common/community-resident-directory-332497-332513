"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useSession } from "@/lib/session";
import { useWebSocket } from "@/lib/useWebSocket";

type Announcement = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

const demoAnnouncements: Announcement[] = [
  {
    id: "a1",
    title: "Welcome",
    body: "Welcome to the community directory!",
    createdAt: new Date().toISOString(),
  },
];

export default function AnnouncementsPage() {
  const { session } = useSession();
  const [items, setItems] = React.useState<Announcement[]>(demoAnnouncements);

  useWebSocket<{ type: string; announcement?: Announcement }>({
    path: session?.token
      ? `/realtime/announcements?token=${encodeURIComponent(session.token)}`
      : "/realtime/announcements?token=",
    onMessage: (msg) => {
      // Only handle announcement events; ignore keepalive/unknown messages safely.
      if (msg?.type === "announcement.created" && msg.announcement) {
        setItems((prev) => [msg.announcement!, ...prev]);
      }
      if (msg?.type === "announcement.updated" && msg.announcement) {
        setItems((prev) =>
          prev.map((a) => (a.id === msg.announcement!.id ? msg.announcement! : a))
        );
      }
    },
  });

  const query = useQuery({
    queryKey: ["announcements"],
    queryFn: async (): Promise<Announcement[]> => {
      // return apiClient.get<Announcement[]>("/announcements", session);
      await apiClient.get<{ message: string }>("/", session).catch(() => ({ message: "offline" }));
      return demoAnnouncements;
    },
  });

  React.useEffect(() => {
    if (query.data) setItems(query.data);
  }, [query.data]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Announcements</h1>
      <p className="mt-1 text-sm text-gray-600">
        Live updates appear automatically when connected.
      </p>

      <div className="mt-6 space-y-3">
        {items.map((a) => (
          <article
            key={a.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <header className="flex items-start justify-between gap-4">
              <h2 className="text-base font-semibold text-gray-900">{a.title}</h2>
              <time className="text-xs text-gray-500">
                {new Date(a.createdAt).toLocaleString()}
              </time>
            </header>
            <p className="mt-2 text-sm text-gray-700">{a.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
