# Replit.md - Nilo Education Website

## Overview

This is a full-stack web application for Nilo, built with a modern React frontend and Express.js backend. The application serves as a creative educational platform featuring information about programs, comprehensive subjects, admissions, and an AI-powered educational chat assistant. The website has been redesigned with a modern, creative approach featuring animations, gradients, and emojis for a more engaging user experience.

## User Preferences

Preferred communication style: Simple, everyday language.
Website style: Creative and modern design with animations, no "International School" references, just "Nilo"
Brand identity: Uses the uploaded Nilo logo, emphasizes education excellence and creativity

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Style**: RESTful API endpoints
- **Middleware**: JSON parsing, URL encoding, request logging
- **Error Handling**: Centralized error middleware
- **Development**: Hot reload with Vite middleware integration

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured for Neon Database)
- **Schema Management**: Drizzle Kit for migrations
- **Storage Pattern**: Repository pattern with in-memory fallback for development

## Key Components

### Core Entities
1. **Applications**: Student admission applications with personal and academic information
2. **Contacts**: General contact form submissions from website visitors
3. **Chat Messages**: AI chat interactions with educational content filtering

### Pages and Features
- **Home**: Creative hero section with animated elements, school overview and key highlights
- **About**: Mission, vision, values, and institutional information (no "International School" references)
- **Programs**: Academic programs for different age groups (Elementary, Middle, High School)
- **Subjects**: Comprehensive curriculum breakdown by subject categories with interactive features
- **Admissions**: Application form for prospective students
- **Contact**: Contact form and institutional information
- **AI Chat**: Educational assistant powered by OpenAI GPT-4o (branded as "Nilo AI")

### AI Integration
- **Educational Content Filter**: Determines if questions are education-related
- **Smart Responses**: Provides contextual educational assistance
- **Content Moderation**: Restricts non-educational queries

## Data Flow

### Application Submission Flow
1. User fills out admissions form with student and parent information
2. Frontend validates data using Zod schemas
3. Backend receives and validates application data
4. Application stored in database with auto-generated ID and timestamp

### Contact Form Flow
1. User submits contact form with inquiry details
2. Form data validated on client and server
3. Contact record created in database
4. Success confirmation displayed to user

### AI Chat Flow
1. User submits question through chat interface
2. Backend sends question to OpenAI for educational content classification
3. If educational, generates appropriate response using GPT-4o
4. Chat interaction logged to database
5. Response displayed in chat interface

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Database ORM and query builder
- **openai**: AI chat functionality
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React routing

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

### Development Dependencies
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for development
- **esbuild**: Production bundling

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Static Assets**: Frontend assets served by Express in production

### Environment Configuration
- **Development**: Uses Vite dev server with HMR
- **Production**: Express serves static files and API routes
- **Database**: Requires `DATABASE_URL` environment variable
- **AI Features**: Requires `OPENAI_API_KEY` for chat functionality

### Production Setup
- Single Express server handles both API and static file serving
- Database migrations managed through Drizzle Kit
- Environment-specific configurations for Replit deployment
- Error boundaries and logging for production monitoring

The application follows a monorepo structure with clear separation between client, server, and shared code, making it maintainable and scalable for educational institution needs.