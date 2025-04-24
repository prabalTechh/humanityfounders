// app/api/auth/magic-link/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../lib/db";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// Generate a random token
const generateMagicToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate input
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // For security reasons, always return a success response
    // even if the user doesn't exist to prevent email enumeration
    if (!user) {
      console.log(`Magic link requested for non-existent user: ${email}`);
      return NextResponse.json({ message: "Magic link sent if email exists" });
    }

    // Generate a unique token
    const magicToken = generateMagicToken();
    
    // Store the token in the database or create a magic link token record
    // Note: You would need to extend your schema to include a MagicLink model
    // This is a simplified example - in production, add expiration, etc.
    
    // Example schema addition:
    // model MagicLink {
    //   id        String   @id @default(cuid())
    //   token     String   @unique
    //   userId    String
    //   user      User     @relation(fields: [userId], references: [id])
    //   createdAt DateTime @default(now())
    //   expiresAt DateTime
    //   used      Boolean  @default(false)
    // }

    // In a real implementation, you would save the token to your database
    // await prisma.magicLink.create({
    //   data: {
    //     token: magicToken,
    //     userId: user.id,
    //     expiresAt: new Date(Date.now() + 3600000), // 1 hour
    //   },
    // });

    // For now, just log it (in production, send an email)
    console.log(`Magic link for ${email}: ${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${magicToken}`);
    
    // In a real application, you would send an email with the magic link
    // await sendEmail({
    //   to: email,
    //   subject: "Your Magic Link",
    //   text: `Click here to log in: ${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${magicToken}`,
    // });

    return NextResponse.json({ message: "Magic link sent if email exists" });
    
  } catch (error: any) {
    console.error("Magic link error:", error);
    
    return NextResponse.json({ 
      message: "Failed to send magic link", 
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error"
    }, { status: 500 });
  }
}