import type { Express } from "express";
import { createServer, type Server } from "http";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { 
  insertApplicationSchema, insertContactSchema, insertChatMessageSchema, 
  insertGroupSchema, insertGroupMemberSchema, insertUserSchema,
  insertGroupMessageSchema, insertMessageReactionSchema, insertGroupPollSchema,
  insertPollVoteSchema, insertRaiseHandRequestSchema, insertFileAttachmentSchema,
  insertClassSchema, insertClassEnrollmentSchema, insertAssignmentSchema,
  insertNewsArticleSchema, insertEventSchema, insertEventRegistrationSchema,
  insertNewsCommentSchema, insertStaffProfileSchema, insertStaffAchievementSchema
} from "@shared/schema";
import { isEducationalQuestion, answerEducationalQuestion, isDemoMode, type ChatResponse } from "./services/openai";
import { GroupChatWebSocketService } from "./websocket";
import { authMiddleware, requireRole, generateToken, type AuthenticatedRequest } from "./middleware/auth";
import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import crypto from "crypto";
import { z } from "zod";
import express from 'express';



// Auth validation schemas
const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().optional(),
}).omit({
  passwordHash: true,
  emailVerificationToken: true,
  role: true, // SECURITY: Users cannot choose their own role
}).refine((data) => !data.confirmPassword || data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  username: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters long"),
});

const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

const elevateRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  newRole: z.enum(["student", "teacher", "admin"], { message: "Role must be student, teacher, or admin" }),
});

// Rate limiting configuration for authentication endpoints
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: { message: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Progressive delay for repeated failed attempts
const authSlowDown = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 2, // Allow 2 attempts per windowMs without delay
  delayMs: () => 500, // Add 500ms delay per attempt after delayAfter (updated for v2)
  maxDelayMs: 10000, // Max delay of 10 seconds
});

// Stricter rate limiting for forgot password (to prevent email spam)
const forgotPasswordRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 forgot password requests per hour
  message: { message: 'Too many password reset attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});


export async function registerRoutes(app: Express): Promise<Server> {
  // ==================== AUTHENTICATION ROUTES ====================
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/auth/login", (req, res, next) => {
  console.log("🛑 CATCH-ALL: Login route hit!");
  console.log("Method:", req.method);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next(); // Continue to the actual login handler
});
  // Register new user
  app.post("/api/auth/register", authRateLimit, authSlowDown, async (req, res) => {
    try {
      // Validate request body using Zod schema
      const validationResult = registerSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validationResult.error.flatten().fieldErrors 
        });
      }

      const { username, email, fullName, password } = validationResult.data;
      // SECURITY: Force all new registrations to student role - only admins can elevate roles
      const role = "student";

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }

      // Hash password and verification tokens
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Generate email verification token and hash it (security best practice)
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const hashedVerificationToken = await bcrypt.hash(emailVerificationToken, saltRounds);

      // Create user
      const user = await storage.createUser({
        username,
        email,
        fullName,
        role,
        passwordHash,
        emailVerificationToken: hashedVerificationToken,
        preferredRole: role
      });

      // Generate JWT token
      const token = generateToken(user.id, user.role);

      // Set HttpOnly cookie with secure settings
      res.cookie('auth_token', token, {
        httpOnly: true, // Prevent XSS attacks
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict', // CSRF protection
        maxAge: 2 * 60 * 60 * 1000, // 2 hours (matches token expiry)
        path: '/' // Available for all routes
      });

      // Don't return password hash or token in response
      const { passwordHash: _, ...userWithoutPassword } = user;

      res.status(201).json({
        message: "User created successfully",
        user: userWithoutPassword
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to create user", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Login user
app.post("/api/auth/login", async (req, res) => {
  try {
    console.log("🎯 LOGIN ENDPOINT HIT!");
    console.log("Request method:", req.method);
    console.log("Request URL:", req.url);
    console.log("Request headers:", req.headers);
    console.log("Request body:", req.body);
    
    // Check if body is parsed
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log("⚠️ Request body is empty - body parser might not be working");
    }
    
    const { username, password } = req.body;
    
    if (!username || !password) {
      console.log("❌ Missing username or password in body");
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }
    
    console.log("🔑 Login attempt for:", username);
    
    // Simple demo users
    const demoUsers = [
      {
        id: '1',
        username: 'student_demo',
        password: 'demo123',
        role: 'student',
        fullName: 'Alex Student',
        email: 'student@eduverse.demo'
      },
      {
        id: '2', 
        username: 'teacher_demo',
        password: 'demo123',
        role: 'teacher',
        fullName: 'Sarah Teacher',
        email: 'teacher@eduverse.demo'
      },
      {
        id: '3',
        username: 'admin_demo',
        password: 'demo123', 
        role: 'admin',
        fullName: 'Mike Administrator',
        email: 'admin@eduverse.demo'
      },
      {
        id: '4',
        username: 'parent_demo',
        password: 'demo123',
        role: 'parent',
        fullName: 'Lisa Parent',
        email: 'parent@eduverse.demo'
      }
    ];

    const user = demoUsers.find(u => u.username === username && u.password === password);
    
    if (!user) {
      console.log("❌ Invalid credentials for:", username);
      return res.json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    console.log("✅ Login successful for:", user.username);
    
    const token = `demo-token-${user.id}-${Date.now()}`;
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error("💥 LOGIN ENDPOINT ERROR:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      error: 'Login failed: ' + (error instanceof Error ? error.message : 'Unknown error')
    });
  }
});

  // Request password reset
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      // Validate request body using Zod schema
      const validationResult = forgotPasswordSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validationResult.error.flatten().fieldErrors 
        });
      }

      const { email } = validationResult.data;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists for security
        return res.json({ message: "If the email exists, a password reset link has been sent" });
      }

      // Generate password reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

      // Hash token before storing (security best practice)
      const saltRounds = 12;
      const hashedToken = await bcrypt.hash(resetToken, saltRounds);
      
      await storage.setPasswordResetToken(user.id, hashedToken, resetExpires);

      // In a real app, you would send an email here
      // SECURITY: Don't log email addresses in production
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Password reset token generated for ${email}`);
      } else {
        console.log('Password reset token generated for user');
      }

      res.json({ 
        message: "If the email exists, a password reset link has been sent"
        // SECURITY: Never echo tokens in responses
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });

  // Reset password with token
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      // Validate request body using Zod schema
      const validationResult = resetPasswordSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validationResult.error.flatten().fieldErrors 
        });
      }

      const { token, newPassword } = validationResult.data;

      // Get all users with reset tokens and find matching hash
      const usersWithResetTokens = await storage.getUsersWithActiveResetTokens();
      let matchedUser = null;
      
      for (const user of usersWithResetTokens) {
        if (user.passwordResetToken && user.passwordResetExpires) {
          // Check if token is expired first
          if (new Date() > user.passwordResetExpires) {
            continue;
          }
          
          // Compare provided token with hashed token in database
          const isTokenValid = await bcrypt.compare(token, user.passwordResetToken);
          if (isTokenValid) {
            matchedUser = user;
            break;
          }
        }
      }
      
      if (!matchedUser) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Hash new password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password and clear reset token
      await storage.updatePassword(matchedUser.id, passwordHash);
      
      // Clear the reset token after successful use (security best practice)
      await storage.clearPasswordResetToken(matchedUser.id);

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Verify email
  app.post("/api/auth/verify-email", async (req, res) => {
    try {
      // Validate request body using Zod schema
      const validationResult = verifyEmailSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validationResult.error.flatten().fieldErrors 
        });
      }

      const { token } = validationResult.data;

      // Get all users with verification tokens and find matching hash (constant-time comparison)
      const usersWithVerificationTokens = await storage.getUsersWithActiveVerificationTokens();
      let matchedUser = null;
      
      for (const user of usersWithVerificationTokens) {
        if (user.emailVerificationToken) {
          // Compare provided token with hashed token in database using constant-time comparison
          const isTokenValid = await bcrypt.compare(token, user.emailVerificationToken);
          if (isTokenValid) {
            matchedUser = user;
            break;
          }
        }
      }
      
      if (!matchedUser) {
        return res.status(400).json({ message: "Invalid verification token" });
      }

      // Verify email and clear token (security best practice)
      await storage.verifyEmail(matchedUser.id);

      res.json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Failed to verify email" });
    }
  });

  // Get current user profile
  app.get("/api/auth/me", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't return password hash
      const { passwordHash: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Failed to get user profile" });
    }
  });

  // Admin-only role elevation endpoint - SECURITY: Only admins can promote users
  app.post("/api/auth/elevate-role", authMiddleware, requireRole(["admin"]), async (req: AuthenticatedRequest, res) => {
    try {
      // Validate request body using Zod schema
      const validationResult = elevateRoleSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validationResult.error.flatten().fieldErrors 
        });
      }

      const { userId, newRole } = validationResult.data;

      // Check if target user exists
      const targetUser = await storage.getUser(userId);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Prevent self-demotion from admin (security measure)
      if (req.userId === userId && req.userRole === "admin" && newRole !== "admin") {
        return res.status(400).json({ message: "Admins cannot demote themselves" });
      }

      // Update user role
      const success = await storage.updateUserRole(userId, newRole);
      if (!success) {
        return res.status(500).json({ message: "Failed to update user role" });
      }

      // Get updated user (without password)
      const updatedUser = await storage.getUser(userId);
      const { passwordHash: _, ...userWithoutPassword } = updatedUser!;

      res.json({
        message: `User role successfully updated to ${newRole}`,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error("Role elevation error:", error);
      res.status(500).json({ message: "Failed to elevate user role" });
    }
  });

  // Create demo users for development
  app.post("/api/auth/create-demo-users", async (req, res) => {
    try {
      const demoUsers = [
        {
          username: "student_demo",
          email: "student@eduverse.demo",
          fullName: "Alex Student",
          role: "student",
          password: "demo123"
        },
        {
          username: "teacher_demo",
          email: "teacher@eduverse.demo", 
          fullName: "Sarah Teacher",
          role: "teacher",
          password: "demo123"
        },
        {
          username: "admin_demo",
          email: "admin@eduverse.demo",
          fullName: "Mike Administrator",
          role: "admin",
          password: "demo123"
        },
        {
          username: "parent_demo",
          email: "parent@eduverse.demo",
          fullName: "Lisa Parent",
          role: "parent",
          password: "demo123"
        },
        // Users who can function as both student and teacher
        {
          username: "teaching_assistant",
          email: "ta@eduverse.demo",
          fullName: "Jordan Teaching Assistant",
          role: "student",
          password: "demo123"
        },
        {
          username: "grad_instructor",
          email: "grad@eduverse.demo",
          fullName: "Taylor Graduate Instructor",
          role: "teacher",
          password: "demo123"
        },
        {
          username: "continuing_teacher",
          email: "continuing@eduverse.demo",
          fullName: "Morgan Continuing Education",
          role: "teacher",
          password: "demo123"
        },
        {
          username: "student_teacher",
          email: "studentteacher@eduverse.demo",
          fullName: "Casey Student Teacher",
          role: "student",
          password: "demo123"
        }
      ];

      const createdUsers = [];
      for (const demoUser of demoUsers) {
        try {
          // Check if user already exists
          const existing = await storage.getUserByUsername(demoUser.username);
          if (existing) {
            console.log(`Demo user ${demoUser.username} already exists, skipping...`);
            continue;
          }

          const passwordHash = await bcrypt.hash(demoUser.password, 12);
          const user = await storage.createUser({
            username: demoUser.username,
            email: demoUser.email,
            fullName: demoUser.fullName,
            role: demoUser.role,
            passwordHash,
            emailVerified: true,
            preferredRole: demoUser.role
          });

          const { passwordHash: _, ...userWithoutPassword } = user;
          createdUsers.push(userWithoutPassword);
        } catch (error) {
          console.error(`Failed to create demo user ${demoUser.username}:`, error);
        }
      }

      res.json({
        message: "Demo users created successfully",
        users: createdUsers,
        credentials: demoUsers.map(u => ({ username: u.username, password: u.password, role: u.role }))
      });
    } catch (error) {
      console.error("Create demo users error:", error);
      res.status(500).json({ message: "Failed to create demo users" });
    }
  });

  // ==================== END AUTHENTICATION ROUTES ====================

  // Applications endpoints
  app.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(validatedData);
      res.json(application);
    } catch (error) {
      res.status(400).json({ message: "Invalid application data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/applications", async (req, res) => {
    try {
      const applications = await storage.getApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/applications/:id", async (req, res) => {
    try {
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch application", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Contacts endpoints
  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.json(contact);
    } catch (error) {
      res.status(400).json({ message: "Invalid contact data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Chat endpoints - Enhanced with robust fallback and error handling
  app.post("/api/chat", async (req, res) => {
    const startTime = Date.now();
    console.log(`[API Chat] Request received at ${new Date().toISOString()}`);
    
    try {
      const { message, buddyType = 'general', chatMode = 'buddy' } = req.body;
      
      // Enhanced input validation
      if (!message || typeof message !== 'string') {
        console.error('[API Chat] Invalid input: missing or invalid message');
        return res.status(400).json({ 
          message: "Message is required and must be a string",
          response: "Please provide a valid message to continue our conversation.",
          demoMode: isDemoMode,
          persona: { buddyType, chatMode },
          error: "Invalid input"
        });
      }

      if (message.trim().length === 0) {
        console.error('[API Chat] Invalid input: empty message');
        return res.status(400).json({ 
          message: "Message cannot be empty",
          response: "Please type a question or message for me to help you with!",
          demoMode: isDemoMode,
          persona: { buddyType, chatMode },
          error: "Empty message"
        });
      }

      console.log(`[API Chat] Processing message with buddy: ${buddyType}, mode: ${chatMode}`);

      // Generate personality-based response with robust fallback
      const aiResponse: ChatResponse = await answerEducationalQuestion(message, buddyType, chatMode);

      // Store the chat message with metadata
      let chatMessage;
      try {
        chatMessage = await storage.createChatMessage({
          message,
          response: aiResponse.response,
          isEducational: 'yes' // Since we answer everything now
        });
        console.log('[API Chat] Successfully stored chat message in database');
      } catch (storageError) {
        console.error('[API Chat] Failed to store chat message:', storageError);
        // Continue without storing - don't break the user experience
        chatMessage = { message, response: aiResponse.response };
      }

      const processingTime = Date.now() - startTime;
      console.log(`[API Chat] Request completed in ${processingTime}ms`);

      // Return consistent API contract with all required fields
      const response = {
        message: chatMessage.message,
        response: aiResponse.response,
        demoMode: aiResponse.demoMode,
        persona: aiResponse.persona,
        // Additional metadata for debugging and analytics
        meta: {
          model: aiResponse.model,
          processingTime,
          timestamp: new Date().toISOString(),
          isEducational: true // We handle all educational content
        }
      };

      res.json(response);
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(`[API Chat] Critical error after ${processingTime}ms:`, error);
      
      // Production-safe fallback response - never break the chat interface
      const { message, buddyType = 'general', chatMode = 'buddy' } = req.body;
      
      // Determine appropriate fallback message based on buddy type
      let fallbackResponse = "I'm experiencing some technical difficulties right now, but I'm still here to help! Please try asking your question again, or feel free to contact our support team.";
      
      if (buddyType === 'funny') {
        fallbackResponse = "Oops! 😅 Looks like I got a bit tangled up in the digital wires! Don't worry though - even the best of us have our 'oops' moments. Try asking me again, and I'll be right back to my helpful, fun-loving self! 🚀";
      } else if (buddyType === 'serious') {
        fallbackResponse = "I apologize for the technical interruption. Our systems are experiencing a temporary issue, but rest assured that your educational support remains our priority. Please resubmit your query, and I will provide the comprehensive assistance you require.";
      } else if (buddyType === 'motivational') {
        fallbackResponse = "Hey there, champion! 💪 Even the strongest systems sometimes need a quick reset - just like how we all need breaks to come back stronger! This little hiccup won't stop us from achieving your learning goals. Give it another shot, and let's keep that momentum going! 🌟";
      }

      res.status(500).json({
        message: message || "System error",
        response: fallbackResponse,
        demoMode: true, // Safe fallback to demo mode on errors
        persona: { buddyType, chatMode },
        meta: {
          error: true,
          processingTime,
          timestamp: new Date().toISOString(),
          errorType: error instanceof Error ? error.name : "UnknownError"
        },
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : "Unknown error") : "Internal server error"
      });
    }
  });

  app.get("/api/chat/history", async (req, res) => {
    try {
      const chatMessages = await storage.getChatMessages();
      res.json(chatMessages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat history", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Group management endpoints
  app.post("/api/groups", async (req: AuthenticatedRequest, res) => {
    try {
      console.log("Creating group with data:", JSON.stringify(req.body, null, 2));
      console.log("Authenticated user ID:", req.userId);
      const validatedData = insertGroupSchema.parse({
        ...req.body,
        createdBy: req.userId  // Use authenticated user ID
      });
      console.log("Validated data:", JSON.stringify(validatedData, null, 2));
      const group = await storage.createGroup(validatedData);
      console.log("Created group:", JSON.stringify(group, null, 2));
      res.json(group);
    } catch (error) {
      console.log("Group creation error:", error);
      res.status(400).json({ message: "Invalid group data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/groups", async (req, res) => {
    try {
      const groups = await storage.getGroups();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch groups", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/groups/:id", async (req, res) => {
    try {
      const group = await storage.getGroup(req.params.id);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      res.json(group);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch group", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/groups/:id/messages", async (req, res) => {
    try {
      const messages = await storage.getGroupMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/groups/:id/members", async (req, res) => {
    try {
      const members = await storage.getGroupMembers(req.params.id);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch group members", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/groups/:id/members", async (req, res) => {
    try {
      const validatedData = insertGroupMemberSchema.parse({
        ...req.body,
        groupId: req.params.id
      });
      const member = await storage.addGroupMember(validatedData);
      res.json(member);
    } catch (error) {
      res.status(400).json({ message: "Invalid member data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Enhanced group management endpoints
  
  // Get public groups (for navigation/discovery)
  app.get("/api/groups/public", async (req, res) => {
    try {
      const groups = await storage.getPublicGroups();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch public groups", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Check if user can join a group
  app.get("/api/groups/:groupId/can-join", async (req: AuthenticatedRequest, res) => {
    try {
      const result = await storage.canUserJoinGroup(req.userId!, req.params.groupId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to check join eligibility", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Join a group
  app.post("/api/groups/:groupId/join", async (req: AuthenticatedRequest, res) => {
    try {
      const groupId = req.params.groupId;
      const userId = req.userId!;

      // Check if user can join
      const eligibility = await storage.canUserJoinGroup(userId, groupId);
      if (!eligibility.canJoin) {
        return res.status(400).json({ message: eligibility.reason });
      }

      // Add user as member
      const member = await storage.addGroupMember({
        groupId,
        userId,
        role: 'member'
      });

      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to join group", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Update member role (promote to moderator, etc.)
  app.patch("/api/groups/:groupId/members/:userId/role", async (req: AuthenticatedRequest, res) => {
    try {
      const { groupId, userId } = req.params;
      const { role } = req.body;
      
      // Check if requester is admin or moderator
      const requesterRole = await storage.getGroupMemberRole(groupId, req.userId!);
      if (requesterRole !== 'admin' && requesterRole !== 'moderator') {
        return res.status(403).json({ message: "Only admins and moderators can change member roles" });
      }

      const success = await storage.updateMemberRole(groupId, userId, role);
      if (!success) {
        return res.status(404).json({ message: "Member not found" });
      }

      res.json({ success: true, message: "Member role updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update member role", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Remove member from group
  app.delete("/api/groups/:groupId/members/:userId", async (req: AuthenticatedRequest, res) => {
    try {
      const { groupId, userId } = req.params;
      
      // Check if requester has permission to remove members
      const requesterRole = await storage.getGroupMemberRole(groupId, req.userId!);
      if (requesterRole !== 'admin' && requesterRole !== 'moderator' && req.userId !== userId) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      const success = await storage.removeGroupMember(groupId, userId);
      if (!success) {
        return res.status(404).json({ message: "Member not found" });
      }

      res.json({ success: true, message: "Member removed from group" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove member", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Update group settings
  app.patch("/api/groups/:groupId/settings", async (req: AuthenticatedRequest, res) => {
    try {
      const groupId = req.params.groupId;
      const { settings } = req.body;
      
      // Check if requester is admin
      const requesterRole = await storage.getGroupMemberRole(groupId, req.userId!);
      if (requesterRole !== 'admin') {
        return res.status(403).json({ message: "Only admins can update group settings" });
      }

      const success = await storage.updateGroupSettings(groupId, settings);
      if (!success) {
        return res.status(404).json({ message: "Group not found" });
      }

      res.json({ success: true, message: "Group settings updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update group settings", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // User management endpoints
  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/users/:id/groups", async (req, res) => {
    try {
      const groups = await storage.getUserGroups(req.params.id);
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user groups", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Message reactions endpoints
  app.post("/api/messages/:messageId/reactions", async (req, res) => {
    try {
      const validatedData = insertMessageReactionSchema.parse({
        ...req.body,
        messageId: req.params.messageId
      });
      const reaction = await storage.addMessageReaction(validatedData);
      res.json(reaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid reaction data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.delete("/api/messages/:messageId/reactions", async (req, res) => {
    try {
      const { userId, emoji } = req.query;
      if (!userId || !emoji) {
        return res.status(400).json({ message: "userId and emoji are required" });
      }
      const success = await storage.removeMessageReaction(req.params.messageId, userId as string, emoji as string);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Reaction not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to remove reaction", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/messages/:messageId/reactions", async (req, res) => {
    try {
      const reactions = await storage.getMessageReactions(req.params.messageId);
      res.json(reactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reactions", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Group polls endpoints
  app.post("/api/groups/:groupId/polls", async (req, res) => {
    try {
      const validatedData = insertGroupPollSchema.parse({
        ...req.body,
        groupId: req.params.groupId
      });
      const poll = await storage.createGroupPoll(validatedData);
      res.json(poll);
    } catch (error) {
      res.status(400).json({ message: "Invalid poll data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/groups/:groupId/polls", async (req, res) => {
    try {
      const polls = await storage.getGroupPolls(req.params.groupId);
      res.json(polls);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch polls", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/polls/:pollId", async (req, res) => {
    try {
      const poll = await storage.getGroupPoll(req.params.pollId);
      if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
      }
      res.json(poll);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch poll", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Poll voting endpoints
  app.post("/api/polls/:pollId/votes", async (req, res) => {
    try {
      const validatedData = insertPollVoteSchema.parse({
        ...req.body,
        pollId: req.params.pollId
      });
      const vote = await storage.addPollVote(validatedData);
      res.json(vote);
    } catch (error) {
      res.status(400).json({ message: "Invalid vote data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.delete("/api/polls/:pollId/votes/:userId", async (req, res) => {
    try {
      const success = await storage.removePollVote(req.params.pollId, req.params.userId);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Vote not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to remove vote", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/polls/:pollId/votes", async (req, res) => {
    try {
      const votes = await storage.getPollVotes(req.params.pollId);
      res.json(votes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch votes", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Raise hand requests endpoints
  app.post("/api/groups/:groupId/raise-hand", async (req, res) => {
    try {
      const validatedData = insertRaiseHandRequestSchema.parse({
        ...req.body,
        groupId: req.params.groupId
      });
      const request = await storage.createRaiseHandRequest(validatedData);
      res.json(request);
    } catch (error) {
      res.status(400).json({ message: "Invalid raise hand request", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/groups/:groupId/raise-hand", async (req, res) => {
    try {
      const requests = await storage.getActiveRaiseHandRequests(req.params.groupId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch raise hand requests", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.patch("/api/raise-hand/:requestId/resolve", async (req, res) => {
    try {
      const { resolvedBy } = req.body;
      if (!resolvedBy) {
        return res.status(400).json({ message: "resolvedBy is required" });
      }
      const success = await storage.resolveRaiseHandRequest(req.params.requestId, resolvedBy);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Raise hand request not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to resolve request", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Group message management endpoints
  app.post("/api/groups/:groupId/messages", async (req, res) => {
    try {
      const validatedData = insertGroupMessageSchema.parse({
        ...req.body,
        groupId: req.params.groupId
      });
      const message = await storage.createGroupMessage(validatedData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Remove group member endpoint
  app.delete("/api/groups/:groupId/members/:userId", async (req, res) => {
    try {
      const success = await storage.removeGroupMember(req.params.groupId, req.params.userId);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Member not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to remove member", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // File upload configuration
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    }),
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit
      files: 5 // Max 5 files per upload
    },
    fileFilter: (req, file, cb) => {
      // Allow common file types (images, documents, videos)
      const allowedMimes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain', 'text/csv',
        'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo',
        'audio/mpeg', 'audio/wav', 'audio/ogg'
      ];
      
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('File type not allowed'));
      }
    }
  });

  // Apply authentication to file routes
  app.use("/api/files", authMiddleware);

  // File upload endpoint
  app.post("/api/files/upload", upload.array('files', 5), async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const { messageId } = req.body;
      if (!messageId) {
        return res.status(400).json({ message: "Message ID is required" });
      }

      const attachments = [];
      
      for (const file of req.files) {
        const validatedData = insertFileAttachmentSchema.parse({
          messageId,
          fileName: file.filename,
          originalName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype,
          fileUrl: `/uploads/${file.filename}`,
          uploadedBy: req.userId!,
          scanStatus: 'safe' // In production, implement virus scanning
        });

        const attachment = await storage.createFileAttachment(validatedData);
        attachments.push(attachment);
      }

      // Broadcast file upload to group via WebSocket
      if (wsService) {
        const message = await storage.getGroupMessage(messageId);
        if (message) {
          wsService.broadcastToGroupExternal(message.groupId, 'file_uploaded', {
            messageId,
            attachments,
            userId: req.userId!
          });
        }
      }

      res.json({ attachments });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(400).json({ message: "File upload failed", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // File download endpoint
  app.get("/api/files/:id/download", async (req: AuthenticatedRequest, res) => {
    try {
      const attachment = await storage.getFileAttachment(req.params.id);
      if (!attachment) {
        return res.status(404).json({ message: "File not found" });
      }

      // Check if user has access to the message/group
      const message = await storage.getGroupMessage(attachment.messageId);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      const isMember = await storage.isGroupMember(req.userId!, message.groupId);
      if (!isMember) {
        return res.status(403).json({ message: "Access denied" });
      }

      const filePath = path.join(uploadDir, path.basename(attachment.fileUrl));
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found on disk" });
      }

      // Increment download count
      await storage.incrementDownloadCount(req.params.id);

      // Set appropriate headers
      res.setHeader('Content-Disposition', `attachment; filename="${attachment.originalName}"`);
      res.setHeader('Content-Type', attachment.mimeType);
      
      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error('File download error:', error);
      res.status(500).json({ message: "File download failed", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get file info endpoint
  app.get("/api/files/:id", async (req: AuthenticatedRequest, res) => {
    try {
      const attachment = await storage.getFileAttachment(req.params.id);
      if (!attachment) {
        return res.status(404).json({ message: "File not found" });
      }

      // Check if user has access to the message/group
      const message = await storage.getGroupMessage(attachment.messageId);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      const isMember = await storage.isGroupMember(req.userId!, message.groupId);
      if (!isMember) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(attachment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch file info", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get message attachments endpoint
  app.get("/api/messages/:messageId/attachments", async (req: AuthenticatedRequest, res) => {
    try {
      const message = await storage.getGroupMessage(req.params.messageId);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      const isMember = await storage.isGroupMember(req.userId!, message.groupId);
      if (!isMember) {
        return res.status(403).json({ message: "Access denied" });
      }

      const attachments = await storage.getMessageAttachments(req.params.messageId);
      res.json(attachments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch attachments", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // === CLASS MANAGEMENT ENDPOINTS ===
  
  // Get classes for a teacher
  app.get("/api/classes", async (req: AuthenticatedRequest, res) => {
    try {
      // For now, return mock data since storage methods aren't implemented yet
      const mockClasses = [
        {
          id: "1",
          name: "Algebra I",
          description: "Introduction to algebraic concepts and problem solving",
          subject: "Mathematics",
          gradeLevel: "Grade 9",
          teacherId: req.userId,
          classCode: "ALG001",
          schedule: { days: ["Monday", "Wednesday", "Friday"], time: "9:00 AM", room: "Room 101" },
          isActive: true,
          maxStudents: 30,
          enrolledStudents: 28,
          createdAt: "2024-01-15T00:00:00Z"
        },
        {
          id: "2", 
          name: "Biology 101",
          description: "Basic principles of biology and life sciences",
          subject: "Science",
          gradeLevel: "Grade 10",
          teacherId: req.userId,
          classCode: "BIO101",
          schedule: { days: ["Tuesday", "Thursday"], time: "11:30 AM", room: "Lab 203" },
          isActive: true,
          maxStudents: 25,
          enrolledStudents: 23,
          createdAt: "2024-01-20T00:00:00Z"
        }
      ];
      
      res.json(mockClasses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch classes", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Create a new class
  app.post("/api/classes", async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertClassSchema.parse({
        ...req.body,
        teacherId: req.userId,
        classCode: Math.random().toString(36).substring(2, 8).toUpperCase()
      });
      
      // For now, return mock data since storage method isn't implemented yet
      const mockClass = {
        id: Math.random().toString(36).substring(2, 15),
        ...validatedData,
        enrolledStudents: 0,
        createdAt: new Date().toISOString()
      };
      
      res.json(mockClass);
    } catch (error) {
      res.status(400).json({ message: "Invalid class data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get specific class
  app.get("/api/classes/:id", async (req: AuthenticatedRequest, res) => {
    try {
      // For now, return mock data
      const mockClass = {
        id: req.params.id,
        name: "Sample Class",
        description: "A sample class for testing",
        subject: "Mathematics",
        gradeLevel: "Grade 9",
        teacherId: req.userId,
        classCode: "SAMPLE001",
        schedule: {},
        isActive: true,
        maxStudents: 30,
        enrolledStudents: 15,
        createdAt: new Date().toISOString()
      };
      
      res.json(mockClass);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch class", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Update class
  app.put("/api/classes/:id", async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertClassSchema.parse(req.body);
      
      // For now, return mock updated data
      const mockUpdatedClass = {
        id: req.params.id,
        ...validatedData,
        teacherId: req.userId,
        enrolledStudents: 15,
        createdAt: "2024-01-15T00:00:00Z",
        updatedAt: new Date().toISOString()
      };
      
      res.json(mockUpdatedClass);
    } catch (error) {
      res.status(400).json({ message: "Invalid class data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  const httpServer = createServer(app);
  
  // Initialize WebSocket service
  const wsService = new GroupChatWebSocketService(httpServer);

  // Demo data initialization moved to /api/auth/create-demo-users endpoint

  // Helper function to find user by username or email
  async function findUserByUsernameOrEmail(identifier: string) {
    // First try to find by username
    let user = await storage.getUserByUsername(identifier);
    
    // If not found and identifier looks like an email, try to find by email
    if (!user && identifier.includes('@')) {
      // Get all users and find one with matching email (simple approach)
      // In production, you'd want a proper getUserByEmail method
      try {
        const allUsers = await storage.getUsers();
        user = allUsers.find(u => u.email === identifier);
      } catch (error) {
        // SECURITY: Don't log email details in production
        if (process.env.NODE_ENV !== 'production') {
          console.log('Error searching users by email:', error);
        } else {
          console.log('Error searching users:', error.message || 'Unknown error');
        }
      }
    }
    
    return user;
  }


app.post("/api/auth/login", async (req, res) => {
  try {
    console.log("=== LOGIN ATTEMPT START ===");
    console.log("Request body:", req.body);
    
    const { username, password } = req.body;
    
    if (!username || !password) {
      console.log("Missing username or password");
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }
    
    console.log("Looking for user:", username);
    
    // Simple demo users
    const demoUsers = [
      {
        id: '1',
        username: 'student_demo',
        password: 'demo123',
        role: 'student',
        fullName: 'Alex Student',
        email: 'student@eduverse.demo'
      },
      {
        id: '2', 
        username: 'teacher_demo',
        password: 'demo123',
        role: 'teacher',
        fullName: 'Sarah Teacher',
        email: 'teacher@eduverse.demo'
      },
      {
        id: '3',
        username: 'admin_demo',
        password: 'demo123', 
        role: 'admin',
        fullName: 'Mike Administrator',
        email: 'admin@eduverse.demo'
      },
      {
        id: '4',
        username: 'parent_demo',
        password: 'demo123',
        role: 'parent',
        fullName: 'Lisa Parent',
        email: 'parent@eduverse.demo'
      }
    ];

    console.log("Available users:", demoUsers.map(u => u.username));
    
    const user = demoUsers.find(u => u.username === username && u.password === password);
    
    if (!user) {
      console.log("❌ User not found or wrong password");
      return res.json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    console.log("✅ User found:", user.username);
    
    const token = `demo-token-${user.id}-${Date.now()}`;
    
    console.log("=== LOGIN SUCCESS ===");
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error("💥 LOGIN ERROR:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      error: 'Login failed: ' + (error instanceof Error ? error.message : 'Unknown error')
    });
  }
});

app.get("/api/test-simple", (req, res) => {
  console.log("✅ Test route hit!");
  res.json({ 
    message: "Server is working!", 
    timestamp: new Date().toISOString() 
  });
});

  // Apply auth middleware to all protected routes
  app.use("/api/groups", authMiddleware);
  app.use("/api/users", authMiddleware);
  app.use("/api/messages", authMiddleware);
  app.use("/api/polls", authMiddleware);
  app.use("/api/raise-hand", authMiddleware);

  // Update message reaction endpoints to broadcast via WebSocket
  app.post("/api/messages/:messageId/reactions", async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertMessageReactionSchema.parse({
        ...req.body,
        messageId: req.params.messageId,
        userId: req.userId  // Use authenticated user ID
      });
      const reaction = await storage.addMessageReaction(validatedData);
      
      // Get message to find group for broadcasting
      const message = await storage.getGroupMessage(req.params.messageId);
      if (message) {
        wsService.broadcastToGroupExternal(message.groupId, 'message_reaction', {
          messageId: req.params.messageId,
          userId: req.userId,
          emoji: validatedData.emoji,
          action: 'add',
          timestamp: new Date().toISOString()
        });
      }
      
      res.json(reaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid reaction data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Update poll creation to broadcast via WebSocket
  app.post("/api/groups/:groupId/polls", requireRole(['teacher', 'admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertGroupPollSchema.parse({
        ...req.body,
        groupId: req.params.groupId,
        createdBy: req.userId
      });
      const poll = await storage.createGroupPoll(validatedData);
      
      // Broadcast new poll to group members
      wsService.broadcastToGroupExternal(req.params.groupId, 'new_poll', poll);
      
      res.json(poll);
    } catch (error) {
      res.status(400).json({ message: "Invalid poll data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Update raise hand to broadcast via WebSocket
  app.post("/api/groups/:groupId/raise-hand", async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertRaiseHandRequestSchema.parse({
        ...req.body,
        groupId: req.params.groupId,
        userId: req.userId
      });
      const request = await storage.createRaiseHandRequest(validatedData);
      
      // Broadcast raise hand request to group members
      wsService.broadcastToGroupExternal(req.params.groupId, 'raise_hand_request', request);
      
      res.json(request);
    } catch (error) {
      res.status(400).json({ message: "Invalid raise hand request", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // === NEWS & EVENTS API ENDPOINTS ===

  // NEWS ARTICLES ROUTES
  app.get("/api/news", async (req, res) => {
    try {
      const { published = 'true' } = req.query;
      const articles = published === 'true' 
        ? await storage.getPublishedNewsArticles()
        : await storage.getNewsArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news articles", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const article = await storage.getNewsArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "News article not found" });
      }

      // Increment view count for published articles
      if (article.isPublished) {
        await storage.incrementNewsViews(req.params.id);
      }

      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news article", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/news/slug/:slug", async (req, res) => {
    try {
      const article = await storage.getNewsArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ message: "News article not found" });
      }

      // Increment view count for published articles
      if (article.isPublished) {
        await storage.incrementNewsViews(article.id);
      }

      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news article", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Protected news article routes
  app.use("/api/admin/news", authMiddleware, requireRole(['admin', 'teacher']));

  app.post("/api/admin/news", async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertNewsArticleSchema.parse({
        ...req.body,
        authorId: req.userId,
        slug: req.body.title ? req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : ''
      });
      const article = await storage.createNewsArticle(validatedData);
      res.json(article);
    } catch (error) {
      res.status(400).json({ message: "Invalid news article data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.put("/api/admin/news/:id", async (req: AuthenticatedRequest, res) => {
    try {
      const updates = insertNewsArticleSchema.partial().parse(req.body);
      const article = await storage.updateNewsArticle(req.params.id, updates);
      if (!article) {
        return res.status(404).json({ message: "News article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(400).json({ message: "Invalid news article data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.delete("/api/admin/news/:id", async (req: AuthenticatedRequest, res) => {
    try {
      const success = await storage.deleteNewsArticle(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "News article not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete news article", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // EVENTS ROUTES
  app.get("/api/events", async (req, res) => {
    try {
      const { upcoming = 'false', published = 'true', startDate, endDate } = req.query;
      
      if (startDate && endDate) {
        const events = await storage.getEventsByDateRange(new Date(startDate as string), new Date(endDate as string));
        res.json(events);
      } else if (upcoming === 'true') {
        const events = await storage.getUpcomingEvents();
        res.json(events);
      } else if (published === 'true') {
        const events = await storage.getPublishedEvents();
        res.json(events);
      } else {
        const events = await storage.getEvents();
        res.json(events);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Protected event routes
  app.use("/api/admin/events", authMiddleware, requireRole(['admin', 'teacher']));

  app.post("/api/admin/events", async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertEventSchema.parse({
        ...req.body,
        organizerId: req.userId
      });
      const event = await storage.createEvent(validatedData);
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.put("/api/admin/events/:id", async (req: AuthenticatedRequest, res) => {
    try {
      const updates = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(req.params.id, updates);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.delete("/api/admin/events/:id", async (req: AuthenticatedRequest, res) => {
    try {
      const success = await storage.deleteEvent(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // EVENT REGISTRATION ROUTES
  app.use("/api/events/:id/register", authMiddleware);

  app.post("/api/events/:id/register", async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertEventRegistrationSchema.parse({
        ...req.body,
        eventId: req.params.id,
        userId: req.userId
      });
      const registration = await storage.registerForEvent(validatedData);
      res.json(registration);
    } catch (error) {
      res.status(400).json({ message: "Failed to register for event", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.delete("/api/events/:id/register", async (req: AuthenticatedRequest, res) => {
    try {
      const success = await storage.cancelEventRegistration(req.params.id, req.userId!);
      if (!success) {
        return res.status(404).json({ message: "Registration not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to cancel registration", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/events/:id/registrations", authMiddleware, requireRole(['admin', 'teacher']), async (req, res) => {
    try {
      const registrations = await storage.getEventRegistrations(req.params.id);
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch registrations", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/user/events", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const registrations = await storage.getUserEventRegistrations(req.userId!);
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user registrations", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // NEWS COMMENTS ROUTES
  app.get("/api/news/:id/comments", async (req, res) => {
    try {
      const comments = await storage.getNewsComments(req.params.id);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.use("/api/news/:id/comments", authMiddleware);

  app.post("/api/news/:id/comments", async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertNewsCommentSchema.parse({
        ...req.body,
        articleId: req.params.id,
        userId: req.userId
      });
      const comment = await storage.createNewsComment(validatedData);
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: "Invalid comment data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.put("/api/admin/comments/:id/approve", authMiddleware, requireRole(['admin', 'teacher']), async (req, res) => {
    try {
      const success = await storage.approveNewsComment(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to approve comment", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.delete("/api/admin/comments/:id", authMiddleware, requireRole(['admin', 'teacher']), async (req, res) => {
    try {
      const success = await storage.deleteNewsComment(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete comment", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // === STAFF DIRECTORY ROUTES ===

  // Public routes for viewing staff directory
  app.get("/api/staff", async (req, res) => {
    try {
      const { search, department } = req.query;
      
      let profiles;
      
      if (search) {
        profiles = await storage.searchStaffProfiles(search as string);
      } else if (department) {
        profiles = await storage.getStaffByDepartment(department as string);
      } else {
        profiles = await storage.getActiveStaffProfiles();
      }
      
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch staff profiles", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/staff/:id", async (req, res) => {
    try {
      const profile = await storage.getStaffProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ message: "Staff profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch staff profile", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/staff/:id/achievements", async (req, res) => {
    try {
      const achievements = await storage.getPublicStaffAchievements(req.params.id);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch staff achievements", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Admin routes for managing staff directory
  app.post("/api/admin/staff", authMiddleware, requireRole(['admin', 'teacher']), async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertStaffProfileSchema.parse(req.body);
      const profile = await storage.createStaffProfile(validatedData);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid staff profile data", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/admin/staff", authMiddleware, requireRole(['admin', 'teacher']), async (req, res) => {
    try {
      const profiles = await storage.getStaffProfiles(); // Include inactive ones for admin
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch staff profiles", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.put("/api/admin/staff/:id", authMiddleware, requireRole(['admin', 'teacher']), async (req: AuthenticatedRequest, res) => {
    try {
      const updates = insertStaffProfileSchema.partial().parse(req.body);
      const profile = await storage.updateStaffProfile(req.params.id, updates);
      if (!profile) {
        return res.status(404).json({ message: "Staff profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(400).json({ 
        message: "Failed to update staff profile", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.delete("/api/admin/staff/:id", authMiddleware, requireRole(['admin']), async (req, res) => {
    try {
      const success = await storage.deleteStaffProfile(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Staff profile not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to delete staff profile", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Staff achievements admin routes
  app.post("/api/admin/staff/:id/achievements", authMiddleware, requireRole(['admin', 'teacher']), async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertStaffAchievementSchema.parse({
        ...req.body,
        staffId: req.params.id
      });
      const achievement = await storage.createStaffAchievement(validatedData);
      res.json(achievement);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid achievement data", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/admin/staff/:id/achievements", authMiddleware, requireRole(['admin', 'teacher']), async (req, res) => {
    try {
      const achievements = await storage.getStaffAchievements(req.params.id); // Include private ones for admin
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch staff achievements", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.delete("/api/admin/achievements/:id", authMiddleware, requireRole(['admin', 'teacher']), async (req, res) => {
    try {
      const success = await storage.deleteStaffAchievement(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Achievement not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to delete achievement", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });
  
  return httpServer;
}
