import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskService } from '../api';
import { CreateTaskRequest, TaskWithPriority } from '../api/types';

export interface TasksState {
  items: TaskWithPriority[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk<TaskWithPriority[]>(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const tasks = await TaskService.getTasks();
      return tasks;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to load tasks');
    }
  }
);

export const createTask = createAsyncThunk<TaskWithPriority, CreateTaskRequest>(
  'tasks/create',
  async (payload, { rejectWithValue }) => {
    try {
      const created = await TaskService.createTask(payload);
      return created;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk<
  TaskWithPriority,
  { id: string; updates: Partial<CreateTaskRequest> }
>(
  'tasks/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const updated = await TaskService.updateTask(id, updates);
      return updated;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk<string, string>(
  'tasks/delete',
  async (id, { rejectWithValue }) => {
    try {
      await TaskService.deleteTask(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to delete task');
    }
  }
);

export const toggleTaskCompletion = createAsyncThunk<
  TaskWithPriority,
  { id: string; completed: boolean }
>(
  'tasks/toggleCompletion',
  async ({ id, completed }, { rejectWithValue }) => {
    try {
      const updated = await TaskService.toggleTaskCompletion(id, completed);
      return updated;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to toggle completion');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<TaskWithPriority[]>) {
      state.items = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to load tasks';
      })
      .addCase(createTask.pending, state => {
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Failed to create task';
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.items = state.items.map(t => (t.id === action.payload.id ? action.payload : t));
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Failed to update task';
      })
      .addCase(toggleTaskCompletion.fulfilled, (state, action) => {
        state.items = state.items.map(t => (t.id === action.payload.id ? action.payload : t));
      })
      .addCase(toggleTaskCompletion.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Failed to toggle completion';
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Failed to delete task';
      });
  },
});

export const { setTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
