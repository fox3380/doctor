import { NextResponse } from "next/server";

const API_BASE_URL = process.env.SKYREADY_API_URL ?? "https://pos.skyready.online";

export async function POST(request: Request) {
  let credentials: { identifier?: string; password?: string };
  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!credentials.identifier || !credentials.password) {
    return NextResponse.json({ error: "Email/username and password are required." }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${API_BASE_URL}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: credentials.identifier, password: credentials.password }),
      cache: "no-store",
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return NextResponse.json({ error: data?.error?.message || "Incorrect email/username or password." }, { status: upstream.status });
    }

    const profileUrl = new URL("/api/a-foxes", API_BASE_URL);
    profileUrl.searchParams.set("filters[users_permissions_user][id][$eq]", String(data.user.id));
    profileUrl.searchParams.set("fields[0]", "Role");
    profileUrl.searchParams.set("pagination[pageSize]", "1");
    const profileResponse = await fetch(profileUrl, {
      headers: { Authorization: `Bearer ${data.jwt}` },
      cache: "no-store",
    });
    const profileData = await profileResponse.json().catch(() => ({}));
    if (!profileResponse.ok) {
      // Some Strapi installations use a server-side policy that prevents
      // authenticated users from reading this collection. Authentication has
      // already succeeded, so let the user into the application in that case.
      if (profileResponse.status === 403) {
        return NextResponse.json({ jwt: data.jwt, user: data.user, profile: null });
      }
      return NextResponse.json(
        { error: "The doctor profile service is currently unavailable." },
        { status: 502 },
      );
    }

    const profile = profileData.data?.[0];
    if (profile && String(profile.Role).toLowerCase() !== "doctor") {
      return NextResponse.json({ error: "This account does not have a doctor profile." }, { status: 403 });
    }

    return NextResponse.json({ jwt: data.jwt, user: data.user, profile });
  } catch {
    return NextResponse.json({ error: "The login service is currently unavailable." }, { status: 502 });
  }
}
