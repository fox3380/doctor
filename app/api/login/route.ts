import { NextResponse } from "next/server";

const STRAPI_API_URL = process.env.STRAPI_API_URL ?? "http://localhost:1337";

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
    const authResponse = await fetch(`${STRAPI_API_URL}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: credentials.identifier,
        password: credentials.password,
      }),
      cache: "no-store",
    });

    const authData = await authResponse.json().catch(() => ({}));
    if (!authResponse.ok) {
      return NextResponse.json(
        { error: authData?.error?.message || "Incorrect email/username or password." },
        { status: authResponse.status || 401 },
      );
    }

    let profile = null;
    try {
      const profileUrl = new URL("/api/doctor-profiles", STRAPI_API_URL);
      profileUrl.searchParams.set("filters[user][id][$eq]", String(authData.user.id));
      profileUrl.searchParams.set("pagination[pageSize]", "1");

      const profileResponse = await fetch(profileUrl, {
        headers: { Authorization: `Bearer ${authData.jwt}` },
        cache: "no-store",
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json().catch(() => ({}));
        const rawProfile = profileData.data?.[0] ?? null;
        if (rawProfile) {
          profile = {
            id: rawProfile.id,
            Role: rawProfile.Role || rawProfile.role || "doctor",
            fullName: rawProfile.fullName || rawProfile.full_name || authData.user.username,
          };
        }
      }
    } catch {
      // Ignore profile fetch error and fallback to default doctor profile
    }

    // Default profile fallback if not found in Strapi doctor-profiles collection
    if (!profile) {
      profile = {
        id: authData.user.id,
        Role: "doctor",
        fullName: authData.user.username || "Doctor",
      };
    }

    return NextResponse.json({ jwt: authData.jwt, user: authData.user, profile });
  } catch {
    return NextResponse.json({ error: "The login service is currently unavailable." }, { status: 502 });
  }
}
