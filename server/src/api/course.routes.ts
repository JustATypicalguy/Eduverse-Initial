// server/src/api/course.routes.ts

import express from 'express';
// We need to add the .js extension for NodeNext module resolution
import { isAuthenticated } from '../middleware/auth.middleware.js'; 
import { createCourse, getCoursesByTeacher, getPublishedCourses } from '../services/course.service.js';

const router = express.Router();

/**
 * PUBLIC
 * GET /api/courses
 * Returns all published courses
 */
router.get('/', async (req, res) => {
    try {
        const courses = await getPublishedCourses();
        res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching published courses:", error);
        res.status(500).json({ message: "Failed to fetch courses." });
    }
});

/**
 * PROTECTED (TEACHER ONLY)
 * GET /api/courses/my-courses
 * Returns all courses owned by the authenticated teacher
 */
router.get('/my-courses', isAuthenticated, async (req, res) => {
    try {
        const user = (req as any).user; // Cast to access the user property
        if (!user || user.role !== 'teacher') {
            return res.status(403).json({ message: 'Forbidden: Teachers only.' });
        }

        const courses = await getCoursesByTeacher(user.id);
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching teacher courses:', error);
        res.status(500).json({ message: 'Failed to fetch courses.' });
    }
});

/**
 * PROTECTED (TEACHER ONLY)
 * POST /api/courses
 * Creates a new course for the authenticated teacher
 */
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const user = (req as any).user;
        if (!user || user.role !== 'teacher') {
            return res.status(403).json({ message: 'Forbidden: Teachers only.' });
        }

        const { title, description } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Title is required.' });
        }

        const newCourse = await createCourse({
            title,
            description,
            teacherId: user.id,
        });

        res.status(201).json(newCourse);
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Failed to create course.' });
    }
});

export default router;