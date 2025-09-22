import { 
  type Application, type InsertApplication, 
  type Contact, type InsertContact, 
  type ChatMessage, type InsertChatMessage,
  type User, type InsertUser,
  type Group, type InsertGroup,
  type GroupMember, type InsertGroupMember,
  type GroupMessage, type InsertGroupMessage,
  type MessageReaction, type InsertMessageReaction,
  type GroupPoll, type InsertGroupPoll,
  type PollVote, type InsertPollVote,
  type RaiseHandRequest, type InsertRaiseHandRequest,
  type FileAttachment, type InsertFileAttachment,
  applications, contacts, chatMessages, users, groups, groupMembers, 
  groupMessages, messageReactions, groupPolls, pollVotes, 
  raiseHandRequests, fileAttachments
} from "@shared/schema";
import { eq, and, inArray, asc, sql } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  // Applications
  createApplication(application: InsertApplication): Promise<Application>;
  getApplications(): Promise<Application[]>;
  getApplication(id: string): Promise<Application | undefined>;
  
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  getContact(id: string): Promise<Contact | undefined>;
  
  // Chat Messages
  createChatMessage(chatMessage: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(): Promise<ChatMessage[]>;
  getChatMessage(id: string): Promise<ChatMessage | undefined>;
  
  // Users
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  
  // Groups
  createGroup(group: InsertGroup): Promise<Group>;
  getGroups(): Promise<Group[]>;
  getGroup(id: string): Promise<Group | undefined>;
  getUserGroups(userId: string): Promise<Group[]>;
  
  // Group Members
  addGroupMember(member: InsertGroupMember): Promise<GroupMember>;
  removeGroupMember(groupId: string, userId: string): Promise<boolean>;
  getGroupMembers(groupId: string): Promise<GroupMember[]>;
  isGroupMember(userId: string, groupId: string): Promise<boolean>;
  
  // Group Messages
  createGroupMessage(message: InsertGroupMessage): Promise<GroupMessage>;
  getGroupMessages(groupId: string): Promise<GroupMessage[]>;
  getGroupMessage(id: string): Promise<GroupMessage | undefined>;
  
  // Message Reactions
  addMessageReaction(reaction: InsertMessageReaction): Promise<MessageReaction>;
  removeMessageReaction(messageId: string, userId: string, emoji: string): Promise<boolean>;
  getMessageReactions(messageId: string): Promise<MessageReaction[]>;
  
  // Group Polls
  createGroupPoll(poll: InsertGroupPoll): Promise<GroupPoll>;
  getGroupPoll(id: string): Promise<GroupPoll | undefined>;
  getGroupPolls(groupId: string): Promise<GroupPoll[]>;
  
  // Poll Votes
  addPollVote(vote: InsertPollVote): Promise<PollVote>;
  removePollVote(pollId: string, userId: string): Promise<boolean>;
  getPollVotes(pollId: string): Promise<PollVote[]>;
  
  // Raise Hand Requests
  createRaiseHandRequest(request: InsertRaiseHandRequest): Promise<RaiseHandRequest>;
  resolveRaiseHandRequest(id: string, resolvedBy: string): Promise<boolean>;
  getActiveRaiseHandRequests(groupId: string): Promise<RaiseHandRequest[]>;
  
  // File Attachments
  createFileAttachment(attachment: InsertFileAttachment): Promise<FileAttachment>;
  getFileAttachment(id: string): Promise<FileAttachment | undefined>;
  getMessageAttachments(messageId: string): Promise<FileAttachment[]>;
  incrementDownloadCount(id: string): Promise<boolean>;
  updateScanStatus(id: string, status: string): Promise<boolean>;
  deleteFileAttachment(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {

  // Applications
  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const [application] = await db
      .insert(applications)
      .values(insertApplication)
      .returning();
    return application;
  }

  async getApplications(): Promise<Application[]> {
    return await db.select().from(applications);
  }

  async getApplication(id: string): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application || undefined;
  }

  // Contacts
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts);
  }

  async getContact(id: string): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact || undefined;
  }

  // Chat Messages
  async createChatMessage(insertChatMessage: InsertChatMessage): Promise<ChatMessage> {
    const [chatMessage] = await db
      .insert(chatMessages)
      .values(insertChatMessage)
      .returning();
    return chatMessage;
  }

  async getChatMessages(): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages);
  }

  async getChatMessage(id: string): Promise<ChatMessage | undefined> {
    const [chatMessage] = await db.select().from(chatMessages).where(eq(chatMessages.id, id));
    return chatMessage || undefined;
  }

  // Users
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  // Groups
  async createGroup(insertGroup: InsertGroup): Promise<Group> {
    const [group] = await db
      .insert(groups)
      .values(insertGroup)
      .returning();
    return group;
  }

  async getGroups(): Promise<Group[]> {
    return await db.select().from(groups);
  }

  async getGroup(id: string): Promise<Group | undefined> {
    const [group] = await db.select().from(groups).where(eq(groups.id, id));
    return group || undefined;
  }

  async getUserGroups(userId: string): Promise<Group[]> {
    const userGroupMembers = await db
      .select()
      .from(groupMembers)
      .where(eq(groupMembers.userId, userId));

    const groupIds = userGroupMembers.map(member => member.groupId);
    if (groupIds.length === 0) return [];

    return await db
      .select()
      .from(groups)
      .where(inArray(groups.id, groupIds));
  }

  // Group Members
  async addGroupMember(insertMember: InsertGroupMember): Promise<GroupMember> {
    const [member] = await db
      .insert(groupMembers)
      .values(insertMember)
      .returning();
    return member;
  }

  async removeGroupMember(groupId: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(groupMembers)
      .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    return await db
      .select()
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));
  }

  async isGroupMember(userId: string, groupId: string): Promise<boolean> {
    const [member] = await db
      .select()
      .from(groupMembers)
      .where(and(eq(groupMembers.userId, userId), eq(groupMembers.groupId, groupId)));
    return !!member;
  }

  // Group Messages
  async createGroupMessage(insertMessage: InsertGroupMessage): Promise<GroupMessage> {
    const [message] = await db
      .insert(groupMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getGroupMessages(groupId: string): Promise<GroupMessage[]> {
    return await db
      .select()
      .from(groupMessages)
      .where(and(eq(groupMessages.groupId, groupId), eq(groupMessages.isDeleted, false)))
      .orderBy(asc(groupMessages.createdAt));
  }

  async getGroupMessage(id: string): Promise<GroupMessage | undefined> {
    const [message] = await db.select().from(groupMessages).where(eq(groupMessages.id, id));
    return message || undefined;
  }

  // Message Reactions
  async addMessageReaction(insertReaction: InsertMessageReaction): Promise<MessageReaction> {
    const [reaction] = await db
      .insert(messageReactions)
      .values(insertReaction)
      .returning();
    return reaction;
  }

  async removeMessageReaction(messageId: string, userId: string, emoji: string): Promise<boolean> {
    const result = await db
      .delete(messageReactions)
      .where(
        and(
          eq(messageReactions.messageId, messageId),
          eq(messageReactions.userId, userId),
          eq(messageReactions.emoji, emoji)
        )
      );
    return (result.rowCount ?? 0) > 0;
  }

  async getMessageReactions(messageId: string): Promise<MessageReaction[]> {
    return await db
      .select()
      .from(messageReactions)
      .where(eq(messageReactions.messageId, messageId));
  }

  // Group Polls
  async createGroupPoll(insertPoll: InsertGroupPoll): Promise<GroupPoll> {
    const [poll] = await db
      .insert(groupPolls)
      .values(insertPoll)
      .returning();
    return poll;
  }

  async getGroupPoll(id: string): Promise<GroupPoll | undefined> {
    const [poll] = await db.select().from(groupPolls).where(eq(groupPolls.id, id));
    return poll || undefined;
  }

  async getGroupPolls(groupId: string): Promise<GroupPoll[]> {
    return await db
      .select()
      .from(groupPolls)
      .where(eq(groupPolls.groupId, groupId));
  }

  // Poll Votes
  async addPollVote(insertVote: InsertPollVote): Promise<PollVote> {
    const [vote] = await db
      .insert(pollVotes)
      .values(insertVote)
      .returning();
    return vote;
  }

  async removePollVote(pollId: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(pollVotes)
      .where(and(eq(pollVotes.pollId, pollId), eq(pollVotes.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  async getPollVotes(pollId: string): Promise<PollVote[]> {
    return await db
      .select()
      .from(pollVotes)
      .where(eq(pollVotes.pollId, pollId));
  }

  // Raise Hand Requests
  async createRaiseHandRequest(insertRequest: InsertRaiseHandRequest): Promise<RaiseHandRequest> {
    const [request] = await db
      .insert(raiseHandRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async resolveRaiseHandRequest(id: string, resolvedBy: string): Promise<boolean> {
    const result = await db
      .update(raiseHandRequests)
      .set({
        isActive: false,
        resolvedBy,
        resolvedAt: new Date(),
      })
      .where(and(eq(raiseHandRequests.id, id), eq(raiseHandRequests.isActive, true)));
    return (result.rowCount ?? 0) > 0;
  }

  async getActiveRaiseHandRequests(groupId: string): Promise<RaiseHandRequest[]> {
    return await db
      .select()
      .from(raiseHandRequests)
      .where(and(eq(raiseHandRequests.groupId, groupId), eq(raiseHandRequests.isActive, true)))
      .orderBy(asc(raiseHandRequests.createdAt));
  }

  // File Attachments
  async createFileAttachment(insertAttachment: InsertFileAttachment): Promise<FileAttachment> {
    const [attachment] = await db
      .insert(fileAttachments)
      .values(insertAttachment)
      .returning();
    return attachment;
  }

  async getFileAttachment(id: string): Promise<FileAttachment | undefined> {
    const [attachment] = await db.select().from(fileAttachments).where(eq(fileAttachments.id, id));
    return attachment || undefined;
  }

  async getMessageAttachments(messageId: string): Promise<FileAttachment[]> {
    return await db
      .select()
      .from(fileAttachments)
      .where(eq(fileAttachments.messageId, messageId))
      .orderBy(asc(fileAttachments.createdAt));
  }

  async incrementDownloadCount(id: string): Promise<boolean> {
    const result = await db
      .update(fileAttachments)
      .set({ downloadCount: sql`${fileAttachments.downloadCount} + 1` })
      .where(eq(fileAttachments.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async updateScanStatus(id: string, status: string): Promise<boolean> {
    const result = await db
      .update(fileAttachments)
      .set({ scanStatus: status })
      .where(eq(fileAttachments.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async deleteFileAttachment(id: string): Promise<boolean> {
    const result = await db
      .delete(fileAttachments)
      .where(eq(fileAttachments.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
