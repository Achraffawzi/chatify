import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axios';
import { SIGNIN_ENDPOINT, USER } from '../utils/constants';

const namespace = 'user';

export const signin = createAsyncThunk(`${namespace}/signin`, async (user, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post(SIGNIN_ENDPOINT, user);
    return data;
  } catch (error) {
    return typeof error.response.data === 'object'
      ? rejectWithValue({ message: error.response?.data?.message, color: 'yellow' })
      : rejectWithValue({ message: 'Incorrect email or password', color: 'red' });
  }
});

const initialState = {
  user: JSON.parse(localStorage.getItem(USER)) || null,
};

const userSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    updateUser: (state, { payload }) => {
      // eslint-disable-next-line no-param-reassign
      state.user = { ...state.user, [payload.name]: [payload.value] };
    },
    cancelFriendRequest: (state, { payload }) => {
      const reqSent = state.user.reqSent.filter((req) => req._id !== payload._id);
      // eslint-disable-next-line no-param-reassign
      state.user = { ...state.user, reqSent };
    },
    logout: (state) => {
      // eslint-disable-next-line no-param-reassign
      state.user = null;
    },
  },
  extraReducers: {
    [signin.fulfilled]: (state, { payload }) => {
      const { accessToken, refreshToken, ...others } = payload;
      // eslint-disable-next-line no-param-reassign
      state.user = others;
    },
  },
});

export const { updateUser, cancelFriendRequest, logout } = userSlice.actions;
export default userSlice.reducer;
