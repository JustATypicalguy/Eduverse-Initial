import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertApplicationSchema, insertContactSchema, insertChatMessageSchema, insertGroupSchema, insertGroupMemberSchema, insertUserSchema } from "@shared/schema";
import { isEducationalQuestion, answerEducationalQuestion, isDemoMode } from "./services/openai";
import { GroupChatWebSocketService } from "./websocket";

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
  app.post("/api/groups", async (req, res) => {
    try {
      const validatedData = insertGroupSchema.parse(req.body);
      const group = await storage.createGroup(validatedData);
      res.json(group);
    } catch (error) {
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

  const httpServer = createServer(app);
  
  // Initialize WebSocket service
  const wsService = new GroupChatWebSocketService(httpServer);
  
  return httpServer;
}
