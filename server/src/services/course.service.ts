// server/src/services/course.service.ts

import { db } from '../db/index.js';
import { courses, users } from '../../../shared/schema.js';
import { and, eq } from 'drizzle-orm';

// Interface for creating a new course.
export interface CreateCourseDto {
    title: string;
    description?: string; // Optional description
    teacherId: string;
}

/**
 * Creates a new course in the database.
 * @param courseData The data for the new course.
 * @returns The newly created course object.
 */
export const createCourse = async (courseData: CreateCourseDto) => {
    const { title, description, teacherId } = courseData;

    // Verify the teacher exists and has the 'teacher' role before creating a course.
    const teacher = await db.select().from(users).where(and(eq(users.id, teacherId), eq(users.role, 'teacher')));
    if (teacher.length === 0) {
        throw new Error("User does not exist or is not a teacher.");
    }

    const newCourse = await db.insert(courses).values({
        title,
        description,
        teacherId,
    }).returning(); // .returning() sends back the created object

    if (!newCourse[0]) {
        throw new Error("Failed to create the course.");
    }

    return newCourse[0];
};

/**
 * Retrieves all courses created by a specific teacher.
 * @param teacherId The ID of the teacher.
 * @returns An array of course objects.
 */
export const getCoursesByTeacher = async (teacherId: string) => {
    const teacherCourses = await db.select().from(courses).where(eq(courses.teacherId, teacherId));
    return teacherCourses;
};

/**
 * Retrieves all courses that are marked as 'published'.
 * This is for students and the general public to see.
 * @returns An array of published course objects.
 */
export const getPublishedCourses = async () => {
    const publishedCourses = await db.select().from(courses).where(eq(courses.isPublished, true));
    return publishedCourses;
};