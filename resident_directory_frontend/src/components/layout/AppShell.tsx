"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import clsx from "clsx";
import { useSession } from "@/lib/session";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={clsx(
        "rounded-lg px-3 py-2 text-sm font-medium",
        active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
      )}
    >
      {children}
    </Link>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { session, signOut } = useSession();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="text-base font-semibold text-gray-900">
            Resident Directory
          </Link>

          <nav className="hidden items-center gap-2 md:flex" aria-label="Primary">
            <NavLink href="/directory">Directory</NavLink>
            <NavLink href="/announcements">Announcements</NavLink>
            <NavLink href="/me">My Profile</NavLink>
            {session?.role === "admin" ? <NavLink href="/admin">Admin</NavLink> : null}
          </nav>

          <div className="flex items-center gap-2">
            {session ? (
              <>
                <span className="hidden text-sm text-gray-600 md:inline">
                  {session.email} ({session.role})
                </span>
                <button
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                  onClick={signOut}
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                href="/signin"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl gap-2 px-4 pb-3 md:hidden">
          <NavLink href="/directory">Directory</NavLink>
          <NavLink href="/announcements">Announcements</NavLink>
          <NavLink href="/me">Me</NavLink>
          {session?.role === "admin" ? <NavLink href="/admin">Admin</NavLink> : null}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
