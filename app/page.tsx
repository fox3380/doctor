"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { login } from "../lib/api";

/* ── tiny icons ─────────────────────────────────────────── */
function ToothIcon() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M15 8c-4.9 0-8 4.1-8 9.4 0 5.9 3.6 10.1 6.7 12.4 1.7 1.3 2.5 4.3 3 7.2.5 2.5 1.2 4.8 3 4.8 2.1 0 2.6-3.1 3-6.2.4-2.6.7-4 1.5-4s1.1 1.4 1.5 4c.4 3.1.9 6.2 3 6.2 1.8 0 2.5-2.3 3-4.8.5-2.9 1.3-5.9 3-7.2 3.1-2.3 6.7-6.5 6.7-12.4C41 12.1 37.9 8 33 8c-3.4 0-5.3 1.5-9 1.5S18.4 8 15 8Z"
        stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 14v6M15 17h6M30 14v6M27 17h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}
function MailIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>
    </svg>
  );
}
function LockIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>
    </svg>
  );
}
function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/>
      <circle cx="12" cy="12" r="2.5"/>
      {hidden && <path d="M4 4 20 20" strokeLinecap="round"/>}
    </svg>
  );
}

/* ── role → route map ───────────────────────────────────── */
const ROLE_ROUTES: Record<string, string> = {
  doctor: "/dashboard",
  admin:  "/dashboard",
  staff:  "/dashboard",
};

/* ── Page ───────────────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter();
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe,   setRememberMe]   = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [notice,       setNotice]       = useState("");
  const [error,        setError]        = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNotice(""); setError(""); setLoading(true);

    try {
      const data = await login({ identifier: email, password });
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("smilecare_jwt",     data.jwt);
      storage.setItem("smilecare_user",    JSON.stringify(data.user));
      if (data.profile) storage.setItem("smilecare_profile", JSON.stringify(data.profile));

      const role        = data.profile?.Role?.toLowerCase() ?? "doctor";
      const destination = ROLE_ROUTES[role] ?? "/dashboard";
      const name        = data.profile?.fullName || data.user.username;
      setNotice(`Welcome back${name ? `, ${name}` : ""}! Redirecting…`);
      setTimeout(() => router.push(destination), 700);
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string })?.error ?? "Unable to sign in. Please try again."
        : "Unable to sign in. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex">
      {/* ── Left — form ─────────────────────────── */}
      <section className="flex flex-1 items-center justify-center px-6 py-14 bg-white">
        <div className="w-full max-w-md">

          {/* brand */}
          <div className="flex items-center gap-3 mb-12">
            <span className="w-12 h-12 rounded-2xl bg-[#2558dc] text-white grid place-items-center shrink-0">
              <ToothIcon />
            </span>
            <span>
              <strong className="block text-lg font-bold tracking-tight">SmileCare</strong>
              <small className="block text-sm text-slate-500 mt-0.5">Dental Clinic Management</small>
            </span>
          </div>

          {/* heading */}
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Welcome back</h1>
          <p className="text-slate-500 text-lg mb-10">Sign in to your clinic dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">Email address</label>
              <div className="flex items-center gap-3 h-13 px-4 border border-slate-200 rounded-2xl shadow-sm text-slate-400 focus-within:border-[#2558dc] focus-within:ring-1 focus-within:ring-[#2558dc] transition-all">
                <MailIcon />
                <input
                  id="email" type="email" required autoComplete="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="doctor@smilecare.com"
                  className="flex-1 bg-transparent outline-none text-[#0d1f3c] placeholder:text-slate-400 text-base min-w-0"
                />
              </div>
            </div>

            {/* password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2">Password</label>
              <div className="flex items-center gap-3 h-13 px-4 border border-[#2159fa] rounded-2xl shadow-sm text-slate-400 focus-within:ring-1 focus-within:ring-[#2159fa] transition-all">
                <LockIcon />
                <input
                  id="password" type={showPassword ? "text" : "password"} required autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="flex-1 bg-transparent outline-none text-[#0d1f3c] placeholder:text-slate-400 text-base min-w-0"
                />
                <button
                  type="button" onClick={() => setShowPassword(p => !p)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  <EyeIcon hidden={!showPassword} />
                </button>
              </div>
            </div>

            {/* remember + forgot */}
            <div className="flex items-center justify-between text-sm text-slate-500">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#2458df] rounded"
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="text-[#1453f5] font-medium hover:underline">Forgot password?</a>
            </div>

            {/* submit */}
            <button
              type="submit" disabled={loading}
              className="w-full h-13 rounded-2xl bg-[#2458df] text-white font-bold text-base shadow-[0_10px_17px_rgba(37,88,223,.24)] hover:bg-[#1948c9] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-wait"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>

            {/* feedback */}
            {error  && <p role="alert"  className="text-center text-[#cf3452] text-sm mt-1">{error}</p>}
            {notice && <p role="status" className="text-center text-emerald-600 text-sm mt-1">{notice}</p>}
          </form>

          <p className="text-center text-sm text-slate-500 mt-9">
            Having trouble?{" "}
            <a href="mailto:support@smilecare.com" className="text-[#1453f5] hover:underline font-medium">Contact support</a>
          </p>
        </div>
      </section>

      {/* ── Right — decorative preview ───────────── */}
      <aside className="hidden lg:flex relative flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-[#2548b9] via-[#265cda] to-[#079cc3]">
        {/* orbs */}
        <div className="absolute w-96 h-96 rounded-full bg-white/10 -top-20 -right-20" />
        <div className="absolute w-[600px] h-[600px] rounded-full bg-white/5 -bottom-80 -left-60" />

        <div className="relative z-10 w-80 text-white">
          {/* mini dashboard card */}
          <div className="rounded-3xl border border-white/20 bg-white/15 backdrop-blur-xl p-9 shadow-2xl">
            <div className="flex items-center gap-3 mb-7">
              <span className="w-12 h-12 rounded-2xl bg-white/20 grid place-items-center"><ToothIcon /></span>
              <span>
                <strong className="block text-base">SmileCare</strong>
                <small className="block text-xs text-blue-200 mt-0.5">Today&apos;s overview</small>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                ["Appointments","24","text-blue-300"],
                ["Patients","1,284","text-emerald-300"],
                ["Revenue","AED 18,400","text-violet-300"],
                ["Pending","AED 3,200","text-yellow-300"],
              ].map(([label, value, cls]) => (
                <div key={label} className="bg-white/15 rounded-2xl p-4">
                  <small className="block text-xs text-blue-200">{label}</small>
                  <strong className={`block mt-1.5 text-lg leading-tight ${cls}`}>{value}</strong>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[["Sara Al-Farsi","Root Canal","09:00","bg-blue-400"],
                ["Mohammed Al-Rashid","Cleaning","10:30","bg-emerald-400"],
                ["Fatima Ibrahim","Braces Check","11:45","bg-violet-400"]].map(([name, tx, time, dot]) => (
                <div key={name} className="flex items-center gap-3 bg-white/15 rounded-xl px-3 py-2.5">
                  <span className={`w-1.5 self-stretch rounded-full ${dot}`} />
                  <span className="flex-1 min-w-0">
                    <strong className="block text-sm">{name}</strong>
                    <small className="text-xs text-blue-200">{tx}</small>
                  </span>
                  <time className="text-xs font-bold text-blue-100">{time}</time>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-7 ml-8 space-y-1.5">
            <strong className="block text-base">The smarter way to run your clinic</strong>
            <span className="block text-sm text-blue-200">Trusted by 500+ dental professionals</span>
          </div>
        </div>
      </aside>
    </main>
  );
}
