import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TodoItem } from '../../component/ToDoList/ToDoList';
import type { RootState } from '../../redux/store'
import { TODOS_URL } from '../../utils/constants';

interface TodoPayload {
  title: string;
} 

export interface ITodo {
  id: string;
  title: string;
}

export interface TodosState {
  todoArray: ITodo[];
  status: string | null;
  error: string | null | unknown
}

const initialState: TodosState = {
  todoArray: [],
  status: null,
  error: null,
}

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(TODOS_URL);

    if (response.ok) {
      return await response.json()
    } else {
      throw new Error('Error in getting data');
    }
  } catch (error: any) {
    return rejectWithValue(error.message);
  }

})

export const addTodo = createAsyncThunk('todos/addTodos', async (newTodo: TodoPayload, {rejectWithValue}) => {
  try{
    const response = await fetch(TODOS_URL,
      {
        method: "POST",
        body: JSON.stringify(newTodo),
        headers: {
          'Content-Type': 'application/json'
        },
      })
  
    if (response.ok) {
      return await response.json()
    } else {
      throw new Error('Error in add data');
    }
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
})

export const deleteTodos = createAsyncThunk('todos/deleteTodos', async (itemId: string, { rejectWithValue }) => {
  try {
    const response = await fetch(`${TODOS_URL}/${itemId}`,
      {
        method: "DELETE"
      })

    if (response.ok) {
      return itemId
    } else {
      throw new Error('Error when deleting');
    }
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
})


export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, { payload }) => {
        state.status = "resolved";
        state.todoArray = payload
      })
      .addCase(fetchTodos.rejected, (state, { payload }) => {
        state.status = "rejected";
        state.error = payload;
      })


      .addCase(addTodo.fulfilled, (state, { payload }) => {
        state.status = "resolved";
        state.todoArray = [...state.todoArray, payload]
      })
      .addCase(addTodo.rejected, (state, { payload }) => {
        state.status = "rejected";
        state.error = payload;
      })

      .addCase(deleteTodos.fulfilled, (state, { payload }) => {
        state.status = "resolved";
        state.todoArray = state.todoArray.filter(item => item.id !== payload)
      })
      .addCase(deleteTodos.rejected, (state, { payload }) => {
        state.status = "rejected";
        state.error = payload;
      })
  }
})

export const selectTodos = ((state: RootState) => state.todoReducer.todoArray);

export default todoSlice.reducer