// server/src/api/course.routes.ts

import express from 'express';
import { isAuthenticated } from '../middleware/auth.middleware';
import { createCourse, getCoursesByTeacher, getPublishedCourses } from '../services/course.service';

const router = express.Router();

// --- ROUTE: GET /api/courses ---
// Public route for anyone to see the list of published courses.
router.get('/', async (req, res) => {
    try {
        const courses = await getPublishedCourses();
        res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching published courses:", error);
        res.status(500).json({ message: "Failed to fetch courses." });
    }
});

// --- ROUTE: GET /api/courses/my-courses ---
// Protected route for a logged-in teacher to see their own courses.
router.get('/my-courses', isAuthenticated, async (req, res) => {
    // req.user is attached by the isAuthenticated middleware
    const teacherId = req.user!.id; 
    
    // Additional check to ensure the user is a teacher
    if (req.user!.role !== 'teacher') {
        return res.status(403).json({ message: "Forbidden: Only teachers can view their courses." });
    }

    try {
        const courses = await getCoursesByTeacher(teacherId);
        res.status(200).json(courses);
    } catch (error) {
        console.error(`Error fetching courses for teacher ${teacherId}:`, error);
        res.status(500).json({ message: "Failed to fetch your courses." });
    }
});

// --- ROUTE: POST /api/courses ---
// Protected route for a teacher to create a new course.
router.post('/', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    const teacherId = req.user!.id;

    if (req.user!.role !== 'teacher') {
        return res.status(403).json({ message: "Forbidden: Only teachers can create courses." });
    }

    if (!title) {
        return res.status(400).json({ message: "Course title is required." });
    }

    try {
        const newCourse = await createCourse({ title, description, teacherId });
        res.status(201).json(newCourse);
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ message: "Failed to create the course." });
    }
});

export default router;