import { pgTable, text, varchar, timestamp, pgEnum,  boolean } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// Define an enum for user roles for better type safety
export const userRoleEnum = pgEnum('user_role', ['student', 'teacher', 'admin']);

export const users = pgTable('users', {
    // We use CUID2 for secure, collision-resistant unique IDs
    id: text('id').$defaultFn(() => createId()).primaryKey(),

    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: text('password').notNull(), // Will store the bcrypt hash
    role: userRoleEnum('role').default('student').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

// --- Courses Table ---
// Represents a single course created by a teacher.
export const courses = pgTable('courses', {
    id: text('id').$defaultFn(() => createId()).primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    
    // Foreign key to link to the teacher who created the course
    teacherId: text('teacher_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

    isPublished: boolean('is_published').default(false).notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

// --- Lessons Table ---
// Represents a single lesson (e.g., a video, PDF, or text) inside a course.
export const lessons = pgTable('lessons', {
    id: text('id').$defaultFn(() => createId()).primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content'), // Could be markdown text, a video URL, etc.
    
    // Foreign key to link to the parent course
    courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
    
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- Enrollments Table (Junction Table) ---
// Tracks which students are enrolled in which courses.
export const enrollments = pgTable('enrollments', {
    id: text('id').$defaultFn(() => createId()).primaryKey(),
    
    // Foreign key to the student
    studentId: text('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    
    // Foreign key to the course
    courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
    
    enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
});
