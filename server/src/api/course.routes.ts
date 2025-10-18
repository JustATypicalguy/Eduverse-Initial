import { Router, Request, Response } from 'express';
import { isAuthenticated } from '../middleware/auth.middleware';
import * as courseService from '../services/course.service';

const router = Router();

/**
 *  PUBLIC
 * GET /api/courses
 * Returns all published courses
 */
router.get('/', async (_req: Request, res: Response) => {
    try {
        const courses = await courseService.getPublishedCourses();
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching published courses:', error);
        res.status(500).json({ message: 'Failed to fetch courses.' });
    }
});

/**
 *  PROTECTED (TEACHER ONLY)
 * POST /api/courses
 * Creates a new course for the authenticated teacher
 */
router.post('/', isAuthenticated, async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user || user.role !== 'teacher') {
            return res.status(403).json({ message: 'Forbidden: Teachers only.' });
        }

        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required.' });
        }

        const newCourse = await courseService.createCourse({
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

/**
 *  PROTECTED (TEACHER ONLY)
 * GET /api/courses/my-courses
 * Returns all courses owned by the authenticated teacher
 */
router.get('/my-courses', isAuthenticated, async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user || user.role !== 'teacher') {
            return res.status(403).json({ message: 'Forbidden: Teachers only.' });
        }

        const courses = await courseService.getCoursesByTeacher(user.id);
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching teacher courses:', error);
        res.status(500).json({ message: 'Failed to fetch courses.' });
    }
});

export default router;
