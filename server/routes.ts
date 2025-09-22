import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertApplicationSchema, insertContactSchema, insertChatMessageSchema, 
  insertGroupSchema, insertGroupMemberSchema, insertUserSchema,
  insertGroupMessageSchema, insertMessageReactionSchema, insertGroupPollSchema,
  insertPollVoteSchema, insertRaiseHandRequestSchema
} from "@shared/schema";
import { isEducationalQuestion, answerEducationalQuestion, isDemoMode } from "./services/openai";
import { GroupChatWebSocketService } from "./websocket";
import { authMiddleware, requireRole, generateToken, type AuthenticatedRequest } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Chat endpoints
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, buddyType = 'general', chatMode = 'buddy' } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required and must be a string" });
      }

      // Generate personality-based response
      const response = await answerEducationalQuestion(message, buddyType, chatMode);

      // Store the chat message with buddy info
      const chatMessage = await storage.createChatMessage({
        message,
        response,
        isEducational: 'yes' // Since we answer everything now
      });

      res.json({ 
        message: chatMessage.message, 
        response: chatMessage.response,
        isEducational: true,
        buddyType,
        chatMode,
        demoMode: isDemoMode
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ 
        message: "Failed to process chat message", 
        response: "I'm experiencing technical difficulties. Please try again later or contact our admissions team for assistance.",
        error: error instanceof Error ? error.message : "Unknown error" 
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

  const httpServer = createServer(app);
  
  // Initialize WebSocket service
  const wsService = new GroupChatWebSocketService(httpServer);

  // Initialize demo data
  initializeDemoData();

  // Auth endpoints (no auth required)
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Simple password check (in production, use proper hashing)
      // For now, just generate token with user info
      const token = generateToken(user.id, user.role);
      
      res.json({ 
        token, 
        user: { id: user.id, username: user.username, role: user.role, fullName: user.fullName }
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed", error: error instanceof Error ? error.message : "Unknown error" });
    }
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
  
  return httpServer;
}

// Initialize demo data for testing
async function initializeDemoData() {
  try {
    // Create demo users
    const demoUsers = [
      {
        username: 'demo_student',
        email: 'student@eduverse.com',
        fullName: 'Alex Student',
        role: 'student'
      },
      {
        username: 'demo_teacher',
        email: 'teacher@eduverse.com', 
        fullName: 'Dr. Sarah Wilson',
        role: 'teacher'
      },
      {
        username: 'demo_admin',
        email: 'admin@eduverse.com',
        fullName: 'Admin User',
        role: 'admin'
      },
      {
        username: 'john_student',
        email: 'john@eduverse.com',
        fullName: 'John Smith',
        role: 'student'
      },
      {
        username: 'emily_student',
        email: 'emily@eduverse.com',
        fullName: 'Emily Johnson',
        role: 'student'
      }
    ];

    const createdUsers: any[] = [];
    for (const userData of demoUsers) {
      try {
        const existingUser = await storage.getUserByUsername(userData.username);
        if (!existingUser) {
          const user = await storage.createUser(userData);
          createdUsers.push(user);
          console.log(`Created demo user: ${user.fullName} (${user.role})`);
        } else {
          createdUsers.push(existingUser);
        }
      } catch (error) {
        console.log(`User ${userData.username} might already exist`);
      }
    }

    // Create demo groups
    const demoGroups = [
      {
        name: 'Biology Study Group',
        description: 'Discuss biology concepts, share notes, and help each other',
        type: 'class',
        icon: '🧬',
        createdBy: createdUsers.find(u => u.role === 'teacher')?.id || createdUsers[1]?.id
      },
      {
        name: 'Math Problem Solving',
        description: 'Work together on challenging math problems',
        type: 'class', 
        icon: '📐',
        createdBy: createdUsers.find(u => u.role === 'teacher')?.id || createdUsers[1]?.id
      },
      {
        name: 'Science Fair Project',
        description: 'Collaborate on science fair projects',
        type: 'project',
        icon: '🔬',
        createdBy: createdUsers.find(u => u.role === 'teacher')?.id || createdUsers[1]?.id
      },
      {
        name: 'School Announcements',
        description: 'Important school updates and announcements',
        type: 'announcement',
        icon: '📢',
        createdBy: createdUsers.find(u => u.role === 'admin')?.id || createdUsers[2]?.id
      }
    ];

    const createdGroups: any[] = [];
    for (const groupData of demoGroups) {
      try {
        const group = await storage.createGroup(groupData);
        createdGroups.push(group);
        console.log(`Created demo group: ${group.name}`);
      } catch (error) {
        console.log(`Error creating group ${groupData.name}:`, error);
      }
    }

    // Add users to groups
    if (createdUsers.length > 0 && createdGroups.length > 0) {
      for (const group of createdGroups) {
        // Add teacher/admin as admin of all groups
        const teacher = createdUsers.find(u => u.role === 'teacher');
        if (teacher) {
          try {
            await storage.addGroupMember({
              groupId: group.id,
              userId: teacher.id,
              role: 'admin'
            });
          } catch (error) {
            console.log(`Error adding teacher to group:`, error);
          }
        }

        // Add students as members
        const students = createdUsers.filter(u => u.role === 'student');
        for (const student of students) {
          try {
            await storage.addGroupMember({
              groupId: group.id,
              userId: student.id,
              role: 'member'
            });
          } catch (error) {
            console.log(`Error adding student to group:`, error);
          }
        }
      }
    }

    // Add some demo messages
    if (createdGroups.length > 0 && createdUsers.length > 0) {
      const biologyGroup = createdGroups.find(g => g.name.includes('Biology'));
      const teacher = createdUsers.find(u => u.role === 'teacher');
      const students = createdUsers.filter(u => u.role === 'student');

      if (biologyGroup && teacher && students.length > 0) {
        try {
          // Teacher welcome message
          await storage.createGroupMessage({
            groupId: biologyGroup.id,
            userId: teacher.id,
            content: 'Welcome to our Biology Study Group! 🧬 Feel free to ask questions, share interesting discoveries, and help each other understand complex concepts. Let\'s make learning biology fun and collaborative!',
            messageType: 'text'
          });

          // Student question
          await storage.createGroupMessage({
            groupId: biologyGroup.id,
            userId: students[0].id,
            content: 'Hi everyone! Can someone help me understand photosynthesis? I\'m having trouble with the light-dependent reactions. 🌱',
            messageType: 'text'
          });

          // Another student\'s response
          if (students[1]) {
            await storage.createGroupMessage({
              groupId: biologyGroup.id,
              userId: students[1].id,
              content: 'Sure! The light-dependent reactions happen in the thylakoids. Chlorophyll absorbs light energy, which splits water molecules (H2O) and produces ATP and NADPH. Think of it as the \"photo\" part of photosynthesis! ☀️',
              messageType: 'text'
            });
          }

          console.log('Created demo messages');
        } catch (error) {
          console.log('Error creating demo messages:', error);
        }
      }
    }

    console.log('Demo data initialization complete!');
  } catch (error) {
    console.log('Error initializing demo data:', error);
  }
}
