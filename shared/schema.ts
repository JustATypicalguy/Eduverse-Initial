import { pgTable, text, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';
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
