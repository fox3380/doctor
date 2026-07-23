"use client";

import { useEffect, useState } from "react";

/* ── helpers ─────────────────────────────────────────────── */
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function todayLabel() {
  return new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

/* ── data ────────────────────────────────────────────────── */
const UPCOMING = [
  { initials: "SA", color: "from-indigo-500 to-violet-400", name: "Sara Al-Farsi",      treatment: "Root Canal",          day: "Tomorrow", time: "09:00" },
  { initials: "LN", color: "from-emerald-500 to-teal-400",  name: "Layla Nasser",       treatment: "Veneers Consultation", day: "Tomorrow", time: "11:00" },
  { initials: "OK", color: "from-amber-500 to-orange-400",  name: "Omar Khalil",         treatment: "Implant Check",        day: "Wed",      time: "10:00" },
  { initials: "FI", color: "from-purple-500 to-pink-400",   name: "Fatima Ibrahim",      treatment: "Orthodontic Check",    day: "Wed",      time: "14:30" },
  { initials: "KM", color: "from-rose-500 to-red-400",      name: "Khalid Al-Mansouri",  treatment: "Tooth Extraction",     day: "Thu",      time: "09:00" },
];

const ACTIVITY = [
  { dot: "bg-[#2558dc]", text: "New appointment booked for Sara Al-Farsi",  time: "2 min ago" },
  { dot: "bg-emerald-500", text: "Payment received — AED 850 from M. Al-Rashid", time: "18 min ago" },
  { dot: "bg-amber-500",  text: "Fatima Ibrahim's X-ray uploaded",          time: "1 hr ago" },
  { dot: "bg-[#2558dc]", text: "Omar Khalil rescheduled to Wednesday",      time: "2 hr ago" },
  { dot: "bg-emerald-500", text: "Monthly report generated",                 time: "Yesterday" },
];

/* ── stat cards data ─────────────────────────────────────── */
const STATS = [
  {
    label: "Today's Appointments", value: "24", sub: "6 completed · 18 remaining",
    badge: "+12%", icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
        <path d="M8 14h.01M12 14h.01M16 14h.01"/>
      </svg>
    ), iconBg: "bg-blue-100 text-blue-600",
  },
  {
    label: "Total Patients", value: "1,284", sub: "18 new this month",
    badge: "+8%", icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3"/><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
        <path d="M20 21c0-3.31-2.69-6-6-6H10c-3.31 0-6 2.69-6 6"/>
      </svg>
    ), iconBg: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "Pending Installments", value: "AED 38,400", sub: "23 active plans",
    badge: "+5%", icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/>
      </svg>
    ), iconBg: "bg-amber-100 text-amber-600",
  },
  {
    label: "Today's Revenue", value: "AED 18,400", sub: "Target: AED 20,000",
    badge: "+5%", icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ), iconBg: "bg-purple-100 text-purple-600",
  },
];

/* ── schedule data ───────────────────────────────────────── */
const SCHEDULE = [
  { time: "09:00", period: "AM", initials: "SA", color: "from-indigo-500 to-violet-400", name: "Sara Al-Farsi",     treatment: "Root Canal · Session 2",  duration: "60 min", badge: "Confirmed", badgeCls: "bg-emerald-100 text-emerald-700" },
  { time: "10:30", period: "AM", initials: "MA", color: "from-emerald-500 to-teal-400",  name: "Mohammed Al-Rashid", treatment: "Dental Cleaning",         duration: "30 min", badge: "In Progress", badgeCls: "bg-blue-100 text-blue-700" },
  { time: "11:15", period: "AM", initials: "FI", color: "from-amber-500 to-orange-400",  name: "Fatima Ibrahim",    treatment: "Orthodontic Check",       duration: "45 min", badge: "Confirmed", badgeCls: "bg-emerald-100 text-emerald-700" },
  { time: "01:00", period: "PM", initials: "KM", color: "from-rose-500 to-red-400",      name: "Khalid Al-Mansouri", treatment: "Tooth Extraction",        duration: "45 min", badge: "Confirmed", badgeCls: "bg-emerald-100 text-emerald-700" },
  { time: "02:30", period: "PM", initials: "NH", color: "from-purple-500 to-pink-400",   name: "Noura Hassan",      treatment: "Whitening Session",       duration: "60 min", badge: "Pending",   badgeCls: "bg-amber-100 text-amber-700" },
];

/* ─────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [docName, setDocName] = useState("Dr. Ahmed");

  useEffect(() => {
    const profile =
      JSON.parse(sessionStorage.getItem("smilecare_profile") ?? "null") ??
      JSON.parse(localStorage.getItem("smilecare_profile")   ?? "null");
    const user =
      JSON.parse(sessionStorage.getItem("smilecare_user") ?? "null") ??
      JSON.parse(localStorage.getItem("smilecare_user")   ?? "null");
    const n = profile?.fullName || user?.username;
    if (n) setDocName(`Dr. ${n}`);
  }, []);

  return (
    <div className="space-y-6">

      {/* ── Page header ─────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {greeting()}, {docName} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {todayLabel()} · 6 appointments today
          </p>
        </div>
        <div className="flex gap-2.5">
          <button className="flex items-center gap-1.5 h-9 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold hover:border-[#2558dc] hover:text-[#2558dc] transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Add Patient
          </button>
          <button className="flex items-center gap-1.5 h-9 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold hover:border-[#2558dc] hover:text-[#2558dc] transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            Book Appointment
          </button>
          <button className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#2558dc] text-white text-sm font-semibold shadow-[0_4px_12px_rgba(37,88,220,.3)] hover:bg-[#1a42b8] hover:-translate-y-0.5 transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Record Payment
          </button>
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────── */}
      <div className="grid grid-cols-4 gap-4">
        {STATS.map(({ label, value, sub, badge, icon, iconBg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className={`w-10 h-10 rounded-xl grid place-items-center ${iconBg}`}>{icon}</span>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m18 15-6-6-6 6"/></svg>
                {badge}
              </span>
            </div>
            <p className="text-2xl font-extrabold tracking-tight leading-none mb-1">{value}</p>
            <p className="text-[13px] font-medium text-slate-500">{label}</p>
            <p className="text-xs text-slate-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Two-column: Schedule + Right panel ──── */}
      <div className="grid grid-cols-[1fr_300px] gap-5">

        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-bold">Today&apos;s Schedule</h2>
              <p className="text-xs text-slate-400 mt-0.5">Monday, 13 July</p>
            </div>
            <a href="#" className="text-xs font-semibold text-[#2558dc] flex items-center gap-1 hover:gap-2 transition-all">
              View all
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </a>
          </div>
          <div className="space-y-1">
            {SCHEDULE.map(({ time, period, initials, color, name, treatment, duration, badge, badgeCls }) => (
              <div key={name} className="grid grid-cols-[56px_36px_1fr_auto] items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="text-xs font-semibold text-slate-500 leading-tight">
                  {time}<span className="block text-[11px] font-normal text-slate-400">{period}</span>
                </div>
                <span className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} text-white text-[11px] font-bold inline-flex items-center justify-center shrink-0`}>
                  {initials}
                </span>
                <div>
                  <strong className="block text-[13.5px] font-semibold">{name}</strong>
                  <small className="text-xs text-slate-400">{treatment}</small>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                    {duration}
                  </span>
                  <span className={`text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full ${badgeCls}`}>{badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ──────────────────────── */}
        <div className="space-y-5">

          {/* Upcoming Patients */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-bold">Upcoming Patients</h2>
              <a href="#" className="text-xs font-semibold text-[#2558dc] flex items-center gap-1 hover:gap-2 transition-all">
                View all
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </a>
            </div>
            <div className="space-y-1">
              {UPCOMING.map(({ initials, color, name, treatment, day, time }) => (
                <div key={name} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <span className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} text-white text-[11px] font-bold inline-flex items-center justify-center shrink-0`}>
                    {initials}
                  </span>
                  <div className="flex-1 min-w-0">
                    <strong className="block text-[13px] font-semibold truncate">{name}</strong>
                    <small className="text-xs text-slate-400">{treatment}</small>
                  </div>
                  <div className="text-right shrink-0">
                    <strong className="block text-[12px] font-bold">{time}</strong>
                    <small className="text-[11px] text-slate-400">{day}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-[15px] font-bold mb-4">Recent Activity</h2>
            <div className="divide-y divide-slate-100">
              {ACTIVITY.map(({ dot, text, time }) => (
                <div key={text} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dot}`} />
                  <span className="flex-1 text-[13px] text-slate-600 leading-snug">{text}</span>
                  <time className="text-[11px] text-slate-400 shrink-0 whitespace-nowrap">{time}</time>
                </div>
              ))}
            </div>
          </div>

        </div>
        {/* ── END RIGHT PANEL ──────────────────── */}

      </div>
    </div>
  );
}
