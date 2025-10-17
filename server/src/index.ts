// server/src/index.ts

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // For handling cross-origin requests from the frontend

// --- Load Environment Variables ---
// This should be the first line to ensure variables are available globally.
dotenv.config();

// --- Import API Routes ---
import authRoutes from './api/auth.routes';
import aiRoutes from './api/ai.routes';
import courseRoutes from './api/course.routes';

// --- Initialize Express App ---
const app = express();
const PORT = process.env.PORT || 3001;

// --- Core Middleware ---
// Enable CORS for all routes - allows your frontend to communicate with this backend.
app.use(cors()); 
// Parse incoming JSON requests.
app.use(express.json());

// --- API Route Definitions ---
// Tell the app to use our route files.
// Any request starting with /api/auth will be handled by authRoutes.
app.use('/api/auth', authRoutes);
// Any request starting with /api/ai will be handled by aiRoutes.
app.use('/api/ai', aiRoutes);
// Any request starting with /api/courses will be handled by courseRoutes.
app.use('/api/courses', courseRoutes);

// --- Health Check Endpoint ---
// A simple route to verify that the server is alive and running.
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`✅ Eduverse backend server is running and listening on http://localhost:${PORT}`);
});