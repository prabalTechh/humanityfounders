// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear the auth cookie
    (await cookies()).delete("auth_token");
    
    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: "Error during logout" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Clear the auth cookie
    (await cookies()).delete("auth_token");
    
    // Redirect to home page
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: "Error during logout" }, { status: 500 });
  }
}