import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-gray-900">
          Community Resident Directory
        </h1>
        <p className="mt-2 text-gray-600">
          Browse residents, manage your profile privacy, and stay up to date with
          announcements.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            href="/directory"
          >
            Go to Directory
          </Link>
          <Link
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 hover:bg-gray-50"
            href="/announcements"
          >
            View Announcements
          </Link>
        </div>

        <div className="mt-8 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
          <p className="font-medium">Demo note</p>
          <p className="mt-1">
            This frontend expects a backend API URL and WebSocket URL to be
            configured via environment variables.
          </p>
        </div>
      </div>
    </main>
  );
}
