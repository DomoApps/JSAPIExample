import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DomoMessage } from 'models';

interface MessagesState {
  messages: DomoMessage[];
}

const initialState: MessagesState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<DomoMessage>) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
});

export const { addMessage, clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
