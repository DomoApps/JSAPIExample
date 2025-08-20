import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { datasetService } from 'services/dataset';

interface DropdownOptionsState {
  options: Record<string, string[]>;
  loading: boolean;
  error: string | null;
  currentSelected: Record<string, string | null>; // Added currentSelected property
}

const initialState: DropdownOptionsState = {
  options: {},
  loading: false,
  error: null,
  currentSelected: {}, // Initialize currentSelected
};

export const fetchDropdownOptions = createAsyncThunk(
  'dropdownOptions/fetchDropdownOptions',
  async (_, { rejectWithValue }) => {
    try {
      const options = await datasetService.getDropdownOptions();
      return options;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

const dropdownOptionsSlice = createSlice({
  name: 'dropdownOptions',
  initialState,
  reducers: {
    fetchOptionsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchOptionsSuccess(
      state,
      action: PayloadAction<Record<string, string[]>>,
    ) {
      state.loading = false;
      state.options = action.payload;
    },
    fetchOptionsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentSelected(
      state,
      action: PayloadAction<{ columnKey: string; value: string | null }>,
    ) {
      const { columnKey, value } = action.payload;
      state.currentSelected[columnKey] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDropdownOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDropdownOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.options = action.payload;
      })
      .addCase(fetchDropdownOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  fetchOptionsStart,
  fetchOptionsSuccess,
  fetchOptionsFailure,
  setCurrentSelected,
} = dropdownOptionsSlice.actions;

export default dropdownOptionsSlice.reducer;
