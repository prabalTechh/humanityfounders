// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Generate JWT token
const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET || "fallback_jwt_secret_not_for_production";
  
  return jwt.sign(
    { id: userId },
    secret,
    { expiresIn: "7d" } // Token expires in 7 days
  );
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    // Check if user exists
    if (!user || !user.password) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = generateToken(user.id);
    
    // Create the response
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email
      }
    });
    
    // Set the authentication cookie
    (await
          // Set the authentication cookie
          cookies()).set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: "/",
    });
    
    return response;
    
  } catch (error: any) {
    console.error("Login error:", error);
    
    return NextResponse.json({
      message: "Login failed",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error"
    }, { status: 500 });
  }
}