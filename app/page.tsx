"use client";


import { FormEvent, useState } from "react";

function ToothIcon({ small = false }: { small?: boolean }) {
  return (
    <svg className={small ? "tooth small" : "tooth"} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M15 8c-4.9 0-8 4.1-8 9.4 0 5.9 3.6 10.1 6.7 12.4 1.7 1.3 2.5 4.3 3 7.2.5 2.5 1.2 4.8 3 4.8 2.1 0 2.6-3.1 3-6.2.4-2.6.7-4 1.5-4s1.1 1.4 1.5 4c.4 3.1.9 6.2 3 6.2 1.8 0 2.5-2.3 3-4.8.5-2.9 1.3-5.9 3-7.2 3.1-2.3 6.7-6.5 6.7-12.4C41 12.1 37.9 8 33 8c-3.4 0-5.3 1.5-9 1.5S18.4 8 15 8Z" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 14v6M15 17h6M30 14v6M27 17h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}

function MailIcon() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function LockIcon() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>; }
function EyeIcon({ hidden }: { hidden: boolean }) { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8"/>{hidden && <path d="M4 4 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>}</svg>; }

const appointments = [
  ["Sara Al-Farsi", "Root Canal", "09:00", "blue"],
  ["Mohammed Al-Rashid", "Cleaning", "10:30", "green"],
  ["Fatima Ibrahim", "Braces Check", "11:45", "purple"],
];

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Signed in successfully — welcome back!");
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="form-wrap">
          <div className="brand">
            <span className="brand-mark"><ToothIcon /></span>
            <span><strong>SmileCare</strong><small>Dental Clinic Management</small></span>
          </div>
          <header><h1>Welcome back</h1><p>Sign in to your clinic dashboard</p></header>
          <form onSubmit={submit}>
            <label>Email address</label>
            <div className="input-wrap"><MailIcon /><input type="email" defaultValue="" aria-label="Email address" required /></div>
            <label>Password</label>
            <div className="input-wrap password-wrap"><LockIcon /><input type={showPassword ? "text" : "password"} defaultValue="smilecare" aria-label="Password" required /><button type="button" className="eye" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility"><EyeIcon hidden={!showPassword} /></button></div>
            <div className="form-options"><label className="remember"><input type="checkbox" /> <span>Remember me</span></label><a href="#forgot">Forgot password?</a></div>
            <button className="sign-in" type="submit">Sign In</button>
            {notice && <p className="notice" role="status">{notice}</p>}
          </form>
          <p className="support">Having trouble signing in? <a href="mailto:support@smilecare.com">Contact support</a></p>
        </div>
      </section>
      <aside className="overview-panel">
        <div className="orb orb-one" /><div className="orb orb-two" />
        <div className="overview-content">
          <div className="dashboard-card">
            <div className="dashboard-heading"><span className="dashboard-mark"><ToothIcon small /></span><span><strong>SmileCare</strong><small>Today&apos;s overview</small></span></div>
            <div className="metrics"><div><small>Appointments</small><strong>24</strong></div><div><small>Patients</small><strong className="mint">1,284</strong></div><div><small>Revenue</small><strong className="violet">AED<br/>18,400</strong></div><div><small>Pending</small><strong className="yellow">AED<br/>3,200</strong></div></div>
            <div className="appointments">{appointments.map(([name, treatment, time, color]) => <div className="appointment" key={name}><i className={color}/><span><strong>{name}</strong><small>{treatment}</small></span><time>{time}</time></div>)}</div>
          </div>
          <div className="tagline"><strong>The smarter way to run your clinic</strong><span>Trusted by 500+ dental professionals</span></div>
        </div>
      </aside>
    </main>
  );
}
