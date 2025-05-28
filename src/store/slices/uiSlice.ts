import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  modal: string | null;
  theme: 'light' | 'dark';
  notification: string | null;
}

const initialState: UIState = {
  modal: null,
  theme: 'dark',
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setModal(state, action: PayloadAction<string | null>) {
      state.modal = action.payload;
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
    },
    setNotification(state, action: PayloadAction<string | null>) {
      state.notification = action.payload;
    },
  },
});

export const { setModal, setTheme, setNotification } = uiSlice.actions;
export default uiSlice.reducer; 