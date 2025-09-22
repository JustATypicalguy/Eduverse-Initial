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
  type RaiseHandRequest, type InsertRaiseHandRequest
} from "@shared/schema";
import { randomUUID } from "crypto";

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
}

export class MemStorage implements IStorage {
  private applications: Map<string, Application>;
  private contacts: Map<string, Contact>;
  private chatMessages: Map<string, ChatMessage>;
  private users: Map<string, User>;
  private groups: Map<string, Group>;
  private groupMembers: Map<string, GroupMember>;
  private groupMessages: Map<string, GroupMessage>;
  private messageReactions: Map<string, MessageReaction>;
  private groupPolls: Map<string, GroupPoll>;
  private pollVotes: Map<string, PollVote>;
  private raiseHandRequests: Map<string, RaiseHandRequest>;

  constructor() {
    this.applications = new Map();
    this.contacts = new Map();
    this.chatMessages = new Map();
    this.users = new Map();
    this.groups = new Map();
    this.groupMembers = new Map();
    this.groupMessages = new Map();
    this.messageReactions = new Map();
    this.groupPolls = new Map();
    this.pollVotes = new Map();
    this.raiseHandRequests = new Map();
  }

  // Applications
  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = randomUUID();
    const application: Application = {
      ...insertApplication,
      id,
      createdAt: new Date(),
      additionalInfo: insertApplication.additionalInfo || null,
    };
    this.applications.set(id, application);
    return application;
  }

  async getApplications(): Promise<Application[]> {
    return Array.from(this.applications.values());
  }

  async getApplication(id: string): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  // Contacts
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      id,
      createdAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async getContact(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  // Chat Messages
  async createChatMessage(insertChatMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const chatMessage: ChatMessage = {
      ...insertChatMessage,
      id,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }

  async getChatMessages(): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values());
  }

  async getChatMessage(id: string): Promise<ChatMessage | undefined> {
    return this.chatMessages.get(id);
  }

  // Users
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  // Groups
  async createGroup(insertGroup: InsertGroup): Promise<Group> {
    const id = randomUUID();
    const group: Group = {
      ...insertGroup,
      id,
      createdAt: new Date(),
    };
    this.groups.set(id, group);
    return group;
  }

  async getGroups(): Promise<Group[]> {
    return Array.from(this.groups.values());
  }

  async getGroup(id: string): Promise<Group | undefined> {
    return this.groups.get(id);
  }

  async getUserGroups(userId: string): Promise<Group[]> {
    const userGroups: Group[] = [];
    for (const member of this.groupMembers.values()) {
      if (member.userId === userId) {
        const group = this.groups.get(member.groupId);
        if (group) {
          userGroups.push(group);
        }
      }
    }
    return userGroups;
  }

  // Group Members
  async addGroupMember(insertMember: InsertGroupMember): Promise<GroupMember> {
    const id = randomUUID();
    const member: GroupMember = {
      ...insertMember,
      id,
      joinedAt: new Date(),
    };
    this.groupMembers.set(id, member);
    return member;
  }

  async removeGroupMember(groupId: string, userId: string): Promise<boolean> {
    for (const [id, member] of this.groupMembers.entries()) {
      if (member.groupId === groupId && member.userId === userId) {
        this.groupMembers.delete(id);
        return true;
      }
    }
    return false;
  }

  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    const members: GroupMember[] = [];
    for (const member of this.groupMembers.values()) {
      if (member.groupId === groupId) {
        members.push(member);
      }
    }
    return members;
  }

  async isGroupMember(userId: string, groupId: string): Promise<boolean> {
    for (const member of this.groupMembers.values()) {
      if (member.userId === userId && member.groupId === groupId) {
        return true;
      }
    }
    return false;
  }

  // Group Messages
  async createGroupMessage(insertMessage: InsertGroupMessage): Promise<GroupMessage> {
    const id = randomUUID();
    const message: GroupMessage = {
      ...insertMessage,
      id,
      createdAt: new Date(),
      editedAt: null,
      isDeleted: false,  // Fix: Initialize isDeleted to false
      isPinned: insertMessage.isPinned ?? false,
      messageType: insertMessage.messageType ?? 'text',
      replyToId: insertMessage.replyToId ?? null,
      metadata: insertMessage.metadata ?? {},
    };
    this.groupMessages.set(id, message);
    return message;
  }

  async getGroupMessages(groupId: string): Promise<GroupMessage[]> {
    const messages: GroupMessage[] = [];
    for (const message of this.groupMessages.values()) {
      if (message.groupId === groupId && !message.isDeleted) {
        messages.push(message);
      }
    }
    return messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getGroupMessage(id: string): Promise<GroupMessage | undefined> {
    return this.groupMessages.get(id);
  }

  // Message Reactions
  async addMessageReaction(insertReaction: InsertMessageReaction): Promise<MessageReaction> {
    const id = randomUUID();
    const reaction: MessageReaction = {
      ...insertReaction,
      id,
      createdAt: new Date(),
    };
    this.messageReactions.set(id, reaction);
    return reaction;
  }

  async removeMessageReaction(messageId: string, userId: string, emoji: string): Promise<boolean> {
    for (const [id, reaction] of this.messageReactions.entries()) {
      if (reaction.messageId === messageId && reaction.userId === userId && reaction.emoji === emoji) {
        this.messageReactions.delete(id);
        return true;
      }
    }
    return false;
  }

  async getMessageReactions(messageId: string): Promise<MessageReaction[]> {
    const reactions: MessageReaction[] = [];
    for (const reaction of this.messageReactions.values()) {
      if (reaction.messageId === messageId) {
        reactions.push(reaction);
      }
    }
    return reactions;
  }

  // Group Polls
  async createGroupPoll(insertPoll: InsertGroupPoll): Promise<GroupPoll> {
    const id = randomUUID();
    const poll: GroupPoll = {
      ...insertPoll,
      id,
      createdAt: new Date(),
    };
    this.groupPolls.set(id, poll);
    return poll;
  }

  async getGroupPoll(id: string): Promise<GroupPoll | undefined> {
    return this.groupPolls.get(id);
  }

  async getGroupPolls(groupId: string): Promise<GroupPoll[]> {
    const polls: GroupPoll[] = [];
    for (const poll of this.groupPolls.values()) {
      if (poll.groupId === groupId) {
        polls.push(poll);
      }
    }
    return polls;
  }

  // Poll Votes
  async addPollVote(insertVote: InsertPollVote): Promise<PollVote> {
    const id = randomUUID();
    const vote: PollVote = {
      ...insertVote,
      id,
      createdAt: new Date(),
    };
    this.pollVotes.set(id, vote);
    return vote;
  }

  async removePollVote(pollId: string, userId: string): Promise<boolean> {
    for (const [id, vote] of this.pollVotes.entries()) {
      if (vote.pollId === pollId && vote.userId === userId) {
        this.pollVotes.delete(id);
        return true;
      }
    }
    return false;
  }

  async getPollVotes(pollId: string): Promise<PollVote[]> {
    const votes: PollVote[] = [];
    for (const vote of this.pollVotes.values()) {
      if (vote.pollId === pollId) {
        votes.push(vote);
      }
    }
    return votes;
  }

  // Raise Hand Requests
  async createRaiseHandRequest(insertRequest: InsertRaiseHandRequest): Promise<RaiseHandRequest> {
    const id = randomUUID();
    const request: RaiseHandRequest = {
      ...insertRequest,
      id,
      createdAt: new Date(),
      resolvedAt: null,
    };
    this.raiseHandRequests.set(id, request);
    return request;
  }

  async resolveRaiseHandRequest(id: string, resolvedBy: string): Promise<boolean> {
    const request = this.raiseHandRequests.get(id);
    if (request && request.isActive) {
      const updatedRequest: RaiseHandRequest = {
        ...request,
        isActive: false,
        resolvedBy,
        resolvedAt: new Date(),
      };
      this.raiseHandRequests.set(id, updatedRequest);
      return true;
    }
    return false;
  }

  async getActiveRaiseHandRequests(groupId: string): Promise<RaiseHandRequest[]> {
    const activeRequests: RaiseHandRequest[] = [];
    for (const request of this.raiseHandRequests.values()) {
      if (request.groupId === groupId && request.isActive) {
        activeRequests.push(request);
      }
    }
    return activeRequests.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}

export const storage = new MemStorage();
