# Construction Site Layout Planning

A web application for optimizing construction site layout - efficiently managing space, equipment, and progress tracking for construction projects.

## Overview

The Construction Site Layout Planning web application is a tool designed to help construction engineers and project managers optimize workspace arrangement, track progress, and manage equipment efficiently. The application provides several key functionalities:

- **Workspace Optimization**: Strategic organization of material storage areas and efficient equipment placement
- **Safety Enhancement**: Hazard zone separation, emergency exit planning, and safety distance maintenance
- **Construction Efficiency**: Material transportation time reduction and workflow optimization
- **Effective Project Management**: Progress tracking by layout and flexible planning adjustments

## Key Features

### Site Layout Management
- Create construction site layouts with an intuitive drag-and-drop interface
- Mark functional areas (material storage, equipment installation, construction zones)
- Update layouts according to construction phases

### Equipment and Material Management
- Detailed equipment/machinery inventory
- Placement optimization for heavy equipment (cranes, mixers, etc.)
- Organization of material storage areas by type

### Progress Management
- Track work progress by zone
- Link progress to areas on the site layout
- Gantt charts and visual reports

### Reporting and Analysis
- Space utilization statistics
- Equipment/material location reports
- Construction site layout exports

## Technology Stack

### Frontend
- **React** - JavaScript/TypeScript framework
- **Redux Toolkit** - State management
- **Tailwind CSS & shadcn/ui** - UI Components & Styling
- **React-Konva** - Canvas drawing and manipulation
- **ReCharts** - Data visualization

### Backend
- **.NET 8 Core** - Backend framework
- **Entity Framework Core** - ORM
- **PostgreSQL** - Database
- **Clean Architecture** - Layered architecture pattern

## Installation and Setup

### System Requirements
- Node.js 18+
- .NET SDK 8.0
- Visual Studio 2022 or Visual Studio Code

### Frontend Setup
```bash
# Navigate to frontend directory
cd fe

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd be/ConstructionSitePlanner

# Restore packages
dotnet restore

# Run migrations
dotnet ef database update

# Start the application
dotnet run
```

## Usage Guide

### Site Layout Management
1. Create a new construction site layout
2. Set up site boundaries (size, shape)
3. Add equipment and functional areas via drag and drop
4. Save and update the layout

### Link Progress to Zones
1. Create work progress items
2. Link progress to areas on the site layout
3. Monitor and update progress

### Equipment Management
1. Add, edit, delete equipment from the catalog
2. Categorize equipment by group
3. Place equipment on the construction site layout

### Reporting and Analysis
1. View progress overview reports
2. View project Gantt charts
3. Export reports and layout images

## 👥 Authors

- Nguyen Trung Hieu
