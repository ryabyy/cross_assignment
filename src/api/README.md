# Task API Integration

This folder contains the API integration for the task tracker app, connecting to MockAPI at `https://6840ae275b39a8039a58d780.mockapi.io/todos`.

## Structure

- `types.ts` - TypeScript interfaces for API data structures
- `utils.ts` - Utility functions for priority conversion and data transformation
- `cache.ts` - Caching mechanism using AsyncStorage for offline support
- `taskService.ts` - Main API service with axios for CRUD operations
- `index.ts` - Exports all API functionality

## Features

### Priority System
- Converts MockAPI's 0-100 priority scale to 3-tier system:
  - Low: < 33 (1 line icon)
  - Medium: 33-66 (2 line icon) 
  - High: > 66 (3 line icon)

### Caching
- Automatic caching of tasks for offline support
- 5-minute cache expiry
- Fallback to cached data when API is unavailable

### API Operations
- `getTasks()` - Fetch all tasks from API
- `getTasksWithCache()` - Fetch with cache fallback
- `createTask()` - Create new task
- `updateTask()` - Update existing task
- `deleteTask()` - Delete task
- `toggleTaskCompletion()` - Toggle task completion status

## Usage

```typescript
import { TaskService } from '../api';

const tasks = await TaskService.getTasksWithCache();

const newTask = await TaskService.createTask({
  title: 'New Task',
  description: 'Task description',
  start_date: new Date().toISOString(),
  end_date: new Date().toISOString(),
  tags: 'work,urgent',
  priority: 50, // Will be converted to 'medium'
  completed: false
});
```
