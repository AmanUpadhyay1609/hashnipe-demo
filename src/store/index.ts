import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tokensReducer from './slices/tokensSlice';
import marketReducer from './slices/marketSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tokens: tokensReducer,
    market: marketReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 