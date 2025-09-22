import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentFirstName: text("student_first_name").notNull(),
  studentLastName: text("student_last_name").notNull(),
  gradeLevel: text("grade_level").notNull(),
  academicYear: text("academic_year").notNull(),
  parentEmail: text("parent_email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  additionalInfo: text("additional_info"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  message: text("message").notNull(),
  response: text("response").notNull(),
  isEducational: text("is_educational").notNull(), // 'yes' or 'no'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});


export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Enhanced Users table for group chat system
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("student"), // 'student', 'teacher', 'admin'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Groups table
export const groups = pgTable("groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'class', 'project', 'announcement'
  icon: text("icon").default("📚"),
  createdBy: varchar("created_by").notNull(),
  isActive: boolean("is_active").default(true),
  settings: json("settings").default({}), // JSON for group-specific settings
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Group members table
export const groupMembers = pgTable("group_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").notNull(),
  userId: varchar("user_id").notNull(),
  role: text("role").notNull().default("member"), // 'admin', 'moderator', 'member'
  isMuted: boolean("is_muted").default(false),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Group messages table
export const groupMessages = pgTable("group_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").notNull(),
  userId: varchar("user_id").notNull(),
  content: text("content").notNull(),
  messageType: text("message_type").notNull().default("text"), // 'text', 'file', 'voice', 'poll', 'quiz'
  replyToId: varchar("reply_to_id"), // For replies
  isPinned: boolean("is_pinned").default(false),
  isDeleted: boolean("is_deleted").default(false),
  metadata: json("metadata").default({}), // File info, poll data, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  editedAt: timestamp("edited_at"),
});

// Message reactions table
export const messageReactions = pgTable("message_reactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  messageId: varchar("message_id").notNull(),
  userId: varchar("user_id").notNull(),
  emoji: text("emoji").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Group polls table
export const groupPolls = pgTable("group_polls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").notNull(),
  messageId: varchar("message_id").notNull(),
  question: text("question").notNull(),
  options: json("options").notNull(), // Array of poll options
  allowMultiple: boolean("allow_multiple").default(false),
  isAnonymous: boolean("is_anonymous").default(false),
  expiresAt: timestamp("expires_at"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Poll votes table
export const pollVotes = pgTable("poll_votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pollId: varchar("poll_id").notNull(),
  userId: varchar("user_id").notNull(),
  optionIndex: integer("option_index").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Raise hand requests table
export const raiseHandRequests = pgTable("raise_hand_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").notNull(),
  userId: varchar("user_id").notNull(),
  question: text("question"),
  isActive: boolean("is_active").default(true),
  resolvedBy: varchar("resolved_by"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// File attachments table
export const fileAttachments = pgTable("file_attachments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  messageId: varchar("message_id").notNull(),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  fileSize: integer("file_size").notNull(), // Size in bytes
  mimeType: text("mime_type").notNull(),
  fileUrl: text("file_url").notNull(), // Path or URL to the file
  thumbnail: text("thumbnail"), // Thumbnail URL for images/videos
  uploadedBy: varchar("uploaded_by").notNull(),
  scanStatus: text("scan_status").notNull().default("pending"), // 'pending', 'safe', 'blocked'
  downloadCount: integer("download_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas for group chat system
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertGroupSchema = createInsertSchema(groups).omit({
  id: true,
  createdAt: true,
});

export const insertGroupMemberSchema = createInsertSchema(groupMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertGroupMessageSchema = createInsertSchema(groupMessages).omit({
  id: true,
  createdAt: true,
  editedAt: true,
});

export const insertMessageReactionSchema = createInsertSchema(messageReactions).omit({
  id: true,
  createdAt: true,
});

export const insertGroupPollSchema = createInsertSchema(groupPolls).omit({
  id: true,
  createdAt: true,
});

export const insertPollVoteSchema = createInsertSchema(pollVotes).omit({
  id: true,
  createdAt: true,
});

export const insertRaiseHandRequestSchema = createInsertSchema(raiseHandRequests).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export const insertFileAttachmentSchema = createInsertSchema(fileAttachments).omit({
  id: true,
  createdAt: true,
  downloadCount: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Group = typeof groups.$inferSelect;
export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type GroupMember = typeof groupMembers.$inferSelect;
export type InsertGroupMember = z.infer<typeof insertGroupMemberSchema>;
export type GroupMessage = typeof groupMessages.$inferSelect;
export type InsertGroupMessage = z.infer<typeof insertGroupMessageSchema>;
export type MessageReaction = typeof messageReactions.$inferSelect;
export type InsertMessageReaction = z.infer<typeof insertMessageReactionSchema>;
export type GroupPoll = typeof groupPolls.$inferSelect;
export type InsertGroupPoll = z.infer<typeof insertGroupPollSchema>;
export type PollVote = typeof pollVotes.$inferSelect;
export type InsertPollVote = z.infer<typeof insertPollVoteSchema>;
export type RaiseHandRequest = typeof raiseHandRequests.$inferSelect;
export type InsertRaiseHandRequest = z.infer<typeof insertRaiseHandRequestSchema>;
export type FileAttachment = typeof fileAttachments.$inferSelect;
export type InsertFileAttachment = z.infer<typeof insertFileAttachmentSchema>;

// === TEACHER PORTAL TABLES ===

// Classes/Courses table - for teacher class management
export const classes = pgTable("classes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  subject: text("subject").notNull(), // e.g., "Mathematics", "Science", "English"
  gradeLevel: text("grade_level").notNull(), // e.g., "Grade 9", "High School"
  teacherId: varchar("teacher_id").notNull(), // FK to users table
  classCode: text("class_code").notNull().unique(), // Unique code students use to join
  schedule: json("schedule").default({}), // JSON for class timing/schedule
  isActive: boolean("is_active").default(true),
  maxStudents: integer("max_students").default(30),
  settings: json("settings").default({}), // Class-specific settings
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Class enrollments - which students are in which classes
export const classEnrollments = pgTable("class_enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  classId: varchar("class_id").notNull(),
  studentId: varchar("student_id").notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  status: text("status").notNull().default("active"), // active, completed, dropped
});

// Assignments table
export const assignments = pgTable("assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  classId: varchar("class_id").notNull(),
  teacherId: varchar("teacher_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  instructions: text("instructions"),
  dueDate: timestamp("due_date"),
  maxScore: integer("max_score").default(100),
  assignmentType: text("assignment_type").notNull().default("homework"), // homework, project, essay
  attachments: json("attachments").default([]), // Array of file references
  isPublished: boolean("is_published").default(false),
  allowLateSubmission: boolean("allow_late_submission").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Student assignment submissions
export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assignmentId: varchar("assignment_id").notNull(),
  studentId: varchar("student_id").notNull(),
  content: text("content"), // Student's written response
  attachments: json("attachments").default([]), // Array of submitted files
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  grade: integer("grade"), // Score received
  feedback: text("feedback"), // Teacher feedback
  isLate: boolean("is_late").default(false),
  gradedAt: timestamp("graded_at"),
  gradedBy: varchar("graded_by"), // Teacher who graded
});

// Quizzes and Exams
export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  classId: varchar("class_id").notNull(),
  teacherId: varchar("teacher_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  questions: json("questions").notNull(), // Array of question objects
  maxScore: integer("max_score").notNull(),
  duration: integer("duration"), // Duration in minutes
  isPublished: boolean("is_published").default(false),
  allowRetake: boolean("allow_retake").default(false),
  randomizeQuestions: boolean("randomize_questions").default(false),
  showCorrectAnswers: boolean("show_correct_answers").default(true),
  availableFrom: timestamp("available_from"),
  availableUntil: timestamp("available_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Quiz attempts by students
export const quizAttempts = pgTable("quiz_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quizId: varchar("quiz_id").notNull(),
  studentId: varchar("student_id").notNull(),
  answers: json("answers").notNull(), // Student's answers
  score: integer("score"),
  maxScore: integer("max_score").notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  submittedAt: timestamp("submitted_at"),
  timeSpent: integer("time_spent"), // Time in seconds
  isCompleted: boolean("is_completed").default(false),
});

// Content Library - for teaching materials
export const contentLibrary = pgTable("content_library", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  contentType: text("content_type").notNull(), // pdf, video, slides, document, image
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"),
  subject: text("subject"), // Subject category
  gradeLevel: text("grade_level"), // Target grade level
  tags: json("tags").default([]), // Array of tags for searching
  uploadedBy: varchar("uploaded_by").notNull(), // Teacher who uploaded
  isPublic: boolean("is_public").default(false), // Shareable with other teachers
  downloads: integer("downloads").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Bookmarks for content library
export const contentBookmarks = pgTable("content_bookmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").notNull(),
  userId: varchar("user_id").notNull(), // Teacher who bookmarked
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Attendance tracking
export const attendance = pgTable("attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  classId: varchar("class_id").notNull(),
  studentId: varchar("student_id").notNull(),
  date: timestamp("date").notNull(),
  status: text("status").notNull().default("present"), // present, absent, late, excused
  notes: text("notes"),
  recordedBy: varchar("recorded_by").notNull(), // Teacher who recorded
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

// Teacher profiles extension (additional info beyond users table)
export const teacherProfiles = pgTable("teacher_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(), // FK to users table
  bio: text("bio"),
  specialization: text("specialization"), // Subject specialization
  education: text("education"), // Educational background
  experience: integer("experience"), // Years of experience
  contactInfo: json("contact_info").default({}), // Additional contact details
  teachingPreferences: json("teaching_preferences").default({}), // Language, style, etc
  isVerified: boolean("is_verified").default(false),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Announcements (teacher to class/group)
export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: varchar("author_id").notNull(), // Teacher who posted
  targetType: text("target_type").notNull(), // 'class', 'group', 'all'
  targetId: varchar("target_id"), // Class ID or Group ID if specific
  priority: text("priority").notNull().default("normal"), // low, normal, high, urgent
  isPublished: boolean("is_published").default(true),
  publishAt: timestamp("publish_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  attachments: json("attachments").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// === INSERT SCHEMAS FOR TEACHER PORTAL ===

export const insertClassSchema = createInsertSchema(classes).omit({
  id: true,
  createdAt: true,
});

export const insertClassEnrollmentSchema = createInsertSchema(classEnrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
  createdAt: true,
});

export const insertAssignmentSubmissionSchema = createInsertSchema(assignmentSubmissions).omit({
  id: true,
  submittedAt: true,
  gradedAt: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  startedAt: true,
  submittedAt: true,
});

export const insertContentLibrarySchema = createInsertSchema(contentLibrary).omit({
  id: true,
  createdAt: true,
  downloads: true,
});

export const insertContentBookmarkSchema = createInsertSchema(contentBookmarks).omit({
  id: true,
  createdAt: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  recordedAt: true,
});

export const insertTeacherProfileSchema = createInsertSchema(teacherProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
});

// === TYPE DEFINITIONS FOR TEACHER PORTAL ===

export type Class = typeof classes.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;

export type ClassEnrollment = typeof classEnrollments.$inferSelect;
export type InsertClassEnrollment = z.infer<typeof insertClassEnrollmentSchema>;

export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;

export type AssignmentSubmission = typeof assignmentSubmissions.$inferSelect;
export type InsertAssignmentSubmission = z.infer<typeof insertAssignmentSubmissionSchema>;

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;

export type ContentLibraryItem = typeof contentLibrary.$inferSelect;
export type InsertContentLibraryItem = z.infer<typeof insertContentLibrarySchema>;

export type ContentBookmark = typeof contentBookmarks.$inferSelect;
export type InsertContentBookmark = z.infer<typeof insertContentBookmarkSchema>;

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

export type TeacherProfile = typeof teacherProfiles.$inferSelect;
export type InsertTeacherProfile = z.infer<typeof insertTeacherProfileSchema>;

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
