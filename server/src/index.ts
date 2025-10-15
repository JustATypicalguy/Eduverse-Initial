// server/src/index.ts
import authRoutes from './api/auth.routes';
import express from 'express';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Import our new, organized routes
import aiRoutes from './api/ai.routes';
// import authRoutes from './api/auth.routes'; // You would create and import these next
// import teacherRoutes from './api/teacher.routes';
// import adminRoutes from './api/admin.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());

// --- API ROUTES ---
// Tell the server to use our new route files.
// Any request starting with /api/ai will be handled by aiRoutes.
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/teachers', teacherRoutes);
// app.use('/api/admin', adminRoutes);

// A simple health check route to make sure the server is running
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`✅ Eduverse server is running at http://localhost:${PORT}`);
});