import {
  createAsyncThunk,
  createSlice,
  SerializedError,
} from "@reduxjs/toolkit";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import type { RootState } from "../../redux/store";
import { TODOS_URL } from "../../utils/constants";

type Status = 'idle' | 'loading' | 'fetching' | 'resolved' |'rejected';

interface ITodoPayload {
  title: string;
}

export interface ITodo {
  id: string;
  title: string;
}

interface ITodosState {
  todoArray: ITodo[];
  status: Status;
  error: SerializedError | null;
}

const initialState: ITodosState = {
  todoArray: [],
  status: 'idle',
  error: null,
};

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(TODOS_URL);
      return await response.json();
    } catch (err) {
      rejectWithValue(err);
    }
  }
);

export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async (newTodo: ITodoPayload, { rejectWithValue }) => {
    try {
      const response = await fetch(TODOS_URL, {
        method: "POST",
        body: JSON.stringify(newTodo),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await response.json();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteSingleTodo = createAsyncThunk(
  "todos/deleteSingleTodo",
  async (itemId: CheckboxValueType, { rejectWithValue }) => {
    try {
      await fetch(`${TODOS_URL}/${itemId}`, { method: "DELETE" });
      return itemId;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteMultipleTodos = createAsyncThunk(
  "todos/deleteMultipleTodos",
  async (checkedItems: CheckboxValueType[], { rejectWithValue }) => {
    try {
      checkedItems.forEach(async (id) => {
        await fetch(`${TODOS_URL}/${id}`, {
          method: "DELETE",
        });
      });

      return checkedItems;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, { payload }) => {
        state.status = "resolved";
        state.todoArray = payload;
      })
      .addCase(fetchTodos.rejected, (state, { error }) => {
        state.status = "rejected";
        state.error = error;
      })

      .addCase(addTodo.pending, (state) => {
        state.status = "fetching";
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, { payload }) => {
        state.status = "resolved";
        console.log('newTodo', payload);
        state.todoArray = [...state.todoArray, payload];
      })
      .addCase(addTodo.rejected, (state, { error }) => {
        state.status = "rejected";
        state.error = error;
      })

      .addCase(deleteSingleTodo.pending, (state) => {
        state.status = "fetching";
        state.error = null;
      })
      .addCase(deleteSingleTodo.fulfilled, (state, { payload }) => {
        state.status = "resolved";
        state.todoArray = state.todoArray.filter((item) => item.id !== payload);
      })
      .addCase(deleteSingleTodo.rejected, (state, { error }) => {
        state.status = "rejected";
        state.error = error;
      })

      .addCase(deleteMultipleTodos.pending, (state) => {
        state.status = "fetching";
        state.error = null;
      })
      .addCase(deleteMultipleTodos.fulfilled, (state, { payload }) => {
        state.status = "resolved";
        state.todoArray = state.todoArray.filter(
          (todo) => todo.id !== payload.find((item) => item === todo.id)
        );
      })
      .addCase(deleteMultipleTodos.rejected, (state, { error }) => {
        state.status = "rejected";
        state.error = error;
      });
  },
});

export const selectTodosData = (state: RootState) => state.todoReducer;

export default todoSlice.reducer;
