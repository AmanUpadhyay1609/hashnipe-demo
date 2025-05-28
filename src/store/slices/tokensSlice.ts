import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export const fetchTokens = createAsyncThunk('tokens/fetchTokens', async () => {
  const res = await fetch('https://api.virtuals.io/api/virtuals');
  if (!res.ok) throw new Error('Failed to fetch tokens');
  const json = await res.json();
  return json.data;
});

interface TokensState {
  list: any[];
  loading: boolean;
  error: string | null;
}

const initialState: TokensState = {
  list: [],
  loading: false,
  error: null,
};

const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTokens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTokens.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTokens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tokens';
      });
  },
});

export default tokensSlice.reducer; 