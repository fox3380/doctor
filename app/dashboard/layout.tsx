"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";

/* ── Icons ──────────────────────────────────────────────── */
function LogoIcon() {
  return (
    <svg className="w-[26px] h-[26px]" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M15 8c-4.9 0-8 4.1-8 9.4 0 5.9 3.6 10.1 6.7 12.4 1.7 1.3 2.5 4.3 3 7.2.5 2.5 1.2 4.8 3 4.8 2.1 0 2.6-3.1 3-6.2.4-2.6.7-4 1.5-4s1.1 1.4 1.5 4c.4 3.1.9 6.2 3 6.2 1.8 0 2.5-2.3 3-4.8.5-2.9 1.3-5.9 3-7.2 3.1-2.3 6.7-6.5 6.7-12.4C41 12.1 37.9 8 33 8c-3.4 0-5.3 1.5-9 1.5S18.4 8 15 8Z"
        stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 14v6M15 17h6M30 14v6M27 17h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}

const NAV_ITEMS = [
  {
    href: "/dashboard", label: "Dashboard",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/patients", label: "Patients",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3"/><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
        <path d="M20 21c0-3.31-2.69-6-6-6H10c-3.31 0-6 2.69-6 6"/><path d="M18 21c0-2.76-1.79-5.11-4.27-5.73"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/appointments", label: "Appointments",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/finance", label: "Finance",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/profile", label: "Profile",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
];

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name.trim().split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-bold text-white bg-gradient-to-br from-[#2558dc] to-sky-400 shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [name, setName]   = useState("Doctor");
  const [role, setRole]   = useState("General Dentist");

  useEffect(() => {
    const jwt = sessionStorage.getItem("smilecare_jwt") || localStorage.getItem("smilecare_jwt");
    if (!jwt) { router.replace("/"); return; }

    const profile =
      JSON.parse(sessionStorage.getItem("smilecare_profile") ?? "null") ??
      JSON.parse(localStorage.getItem("smilecare_profile")   ?? "null");
    const user =
      JSON.parse(sessionStorage.getItem("smilecare_user") ?? "null") ??
      JSON.parse(localStorage.getItem("smilecare_user")   ?? "null");

    if (profile?.fullName)  setName(profile.fullName);
    else if (user?.username) setName(user.username);

    const roleMap: Record<string, string> = { doctor: "General Dentist", admin: "Administrator", staff: "Staff Member" };
    if (profile?.Role) setRole(roleMap[profile.Role.toLowerCase()] ?? profile.Role);
  }, [router]);

  function logout() {
    ["smilecare_jwt","smilecare_user","smilecare_profile"].forEach(k => {
      sessionStorage.removeItem(k);
      localStorage.removeItem(k);
    });
    router.push("/");
  }

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      {/* ── Sidebar ─────────────────────────────────── */}
      <aside className="sticky top-0 h-screen w-[232px] flex flex-col bg-white border-r border-slate-200 shrink-0 px-3 z-50">

        {/* brand */}
        <div className="flex items-center gap-3 px-2 py-5 border-b border-slate-100 mb-2">
          <span className="w-10 h-10 rounded-xl bg-[#2558dc] text-white grid place-items-center shrink-0">
            <LogoIcon />
          </span>
          <span>
            <strong className="block text-[15px] font-bold tracking-tight">SmileCare</strong>
            <small className="block text-xs text-slate-400 mt-0.5">Dental Clinic</small>
          </span>
        </div>

        {/* nav */}
        <nav className="flex flex-col gap-0.5 flex-1 py-1">
          {NAV_ITEMS.map(({ href, label, icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-[#2558dc] text-white shadow-sm"
                    : "text-slate-500 hover:bg-[#eef3ff] hover:text-[#2558dc]"
                }`}
              >
                <span className="shrink-0">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* footer */}
        <div className="flex items-center gap-2.5 px-2 py-4 border-t border-slate-100 mt-auto">
          <Avatar name={name} size={36} />
          <span className="flex-1 min-w-0">
            <strong className="block text-[13px] font-semibold truncate">Dr. {name}</strong>
            <small className="block text-[11px] text-slate-400 mt-0.5">{role}</small>
          </span>
          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            aria-label="Log out"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* topbar */}
        <header className="sticky top-0 z-40 flex items-center gap-4 px-7 h-16 bg-[#f5f7fb]/90 backdrop-blur-md border-b border-slate-200">
          <label htmlFor="global-search" className="flex items-center gap-2.5 flex-1 max-w-sm h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-slate-400 cursor-text focus-within:border-[#2558dc] focus-within:ring-1 focus-within:ring-[#2558dc]/30 transition-all">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input id="global-search" type="search" placeholder="Search patients, appointments…" className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"/>
          </label>

          <div className="flex items-center gap-3 ml-auto">
            <button className="relative w-10 h-10 rounded-xl bg-white border border-slate-200 grid place-items-center text-slate-500 hover:border-[#2558dc] hover:text-[#2558dc] transition-colors" aria-label="Notifications">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-[#f5f7fb]" />
            </button>
            <div className="flex items-center gap-2.5 pl-1 pr-3 py-1 bg-white border border-slate-200 rounded-xl">
              <Avatar name={name} size={32} />
              <span>
                <strong className="block text-[13px] font-semibold">Dr. {name}</strong>
                <small className="block text-[11px] text-slate-400">{role}</small>
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-7">{children}</main>
      </div>
    </div>
  );
}
