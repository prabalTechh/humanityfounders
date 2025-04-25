// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import User from "../../../lib/model/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Hash password before storing
const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Email validation regex
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

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
    // Connect to MongoDB
    await connectDB();
    
    const body = await request.json();
    const { email, password } = body;

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Ensure password meets minimum length
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Hash the password before storing
    const hashedPassword = await hashPassword(password);

    // Create new user in the database
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    //@ts-ignore
    const token = generateToken(newUser._id.toString());
    
    // Create the response
    const response = NextResponse.json({ 
      message: "User created successfully", 
      user: {
        //@ts-ignore
        id: newUser._id.toString(),
        email: newUser.email
      }
    }, { status: 201 });
    
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
    console.error("Error creating user:", error);
    
    // Check for MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json({ 
      message: "Error creating user", 
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error"
    }, { status: 500 });
  }
}