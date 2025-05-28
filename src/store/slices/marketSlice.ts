import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export const fetchMarketData = createAsyncThunk('market/fetchMarketData', async () => {
  const res = await fetch('https://api.virtuals.io/api/market');
  if (!res.ok) throw new Error('Failed to fetch market data');
  const json = await res.json();
  return json.data;
});

interface MarketState {
  prices: any;
  orderBook: any;
  trades: any[];
  loading: boolean;
  error: string | null;
}

const initialState: MarketState = {
  prices: null,
  orderBook: null,
  trades: [],
  loading: false,
  error: null,
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketData.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.prices = action.payload.prices;
        state.orderBook = action.payload.orderBook;
        state.trades = action.payload.trades;
      })
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch market data';
      });
  },
});

export default marketSlice.reducer; 