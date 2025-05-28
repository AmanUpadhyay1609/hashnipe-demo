import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  jwt: string | null;
  user: any | null;
  loading: boolean;
}

const initialState: AuthState = {
  jwt: null,
  user: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setJwt(state, action: PayloadAction<string | null>) {
      state.jwt = action.payload;
    },
    setUser(state, action: PayloadAction<any | null>) {
      state.user = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    logout(state) {
      state.jwt = null;
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setJwt, setUser, setLoading, logout } = authSlice.actions;
export default authSlice.reducer; 