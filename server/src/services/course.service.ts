// server/src/services/course.service.ts

import { db } from '../db/index.js';
// We use the relative path. It's more robust than an alias.
// Path from server/src/services/ -> server/ -> / -> shared/
import { courses, users } from '../../../shared/schema.js'; 
import { and, eq } from 'drizzle-orm';

export interface CreateCourseDto {
    title: string;
    description?: string; 
    teacherId: string;
}

export const createCourse = async (courseData: CreateCourseDto) => {
    const { title, description, teacherId } = courseData;

    const teacher = await db
        .select()
        .from(users)
        .where(and(eq(users.id, teacherId), eq(users.role, 'teacher')));
        
    if (teacher.length === 0) {
        throw new Error("User does not exist or is not a teacher.");
    }

    const newCourse = await db.insert(courses).values({
        title,
        description,
        teacherId,
        isPublished: false, 
    }).returning(); 

    if (!newCourse[0]) {
        throw new Error("Failed to create the course.");
    }

    return newCourse[0];
};

export const getCoursesByTeacher = async (teacherId: string) => {
    const teacherCourses = await db
        .select()
        .from(courses)
        .where(eq(courses.teacherId, teacherId));
    return teacherCourses;
};

export const getPublishedCourses = async () => {
    const publishedCourses = await db
        .select()
        .from(courses)
        .where(eq(courses.isPublished, true));
    return publishedCourses;
};