import { db } from '../db';
import { courses } from '../db/schema';
import { eq } from 'drizzle-orm';

interface CreateCourseInput {
    title: string;
    description: string;
    teacherId: string;
}

/**
 * Create a new course owned by a teacher
 */
export async function createCourse({ title, description, teacherId }: CreateCourseInput) {
    const [course] = await db
        .insert(courses)
        .values({
            title,
            description,
            teacherId,
            isPublished: false,
            createdAt: new Date(),
        })
        .returning();

    return course;
}

/**
 * Get all courses owned by a specific teacher
 */
export async function getCoursesByTeacher(teacherId: string) {
    const result = await db
        .select()
        .from(courses)
        .where(eq(courses.teacherId, teacherId));

    return result;
}

/**
 * Get all published (public) courses
 */
export async function getPublishedCourses() {
    const result = await db
        .select()
        .from(courses)
        .where(eq(courses.isPublished, true));

    return result;
}
