import { getLoginStatus, getUserInfo, getUserStatus } from '@api/user'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
  loginStatus: boolean | undefined
  ignoreAuthPaths: RegExp[]
  onlyAnonymousPaths: RegExp[]
  userInfo: UserInfoVM | undefined | null
  status: UserStatusVM
}
const initialState: AuthState = {
  loginStatus: undefined,
  status: {
    HasUnreadNotification: false,
    HasUnpaidOrder: false,
  },
  ignoreAuthPaths: [
    /^\/p$/,
    /^\/b\/.{10}$/,
    // /^\/p\/.{8}$/,
    /^\/user\/login$/,
    /^\/user\/register$/,
    /^\/user\/forgotpwd$/,
    /^\/$/,
    /^\/home$/,
    /^\/user$/,
    /^\/chat$/,
    /^\/chat\/question$/,
    /^\/system\/report$/,
    /^\/system\/contactme$/,
    /^\/system\/privacy$/,
  ],
  onlyAnonymousPaths: [/^\/user\/login$/],
  userInfo: undefined,
}
export const updateUserInfoAsync = createAsyncThunk(
  'auth/updateUserInfoAsync',
  async (hideLoading: boolean, actions) => {
    let res = await getUserInfo(hideLoading)
    return res.Result
  }
)
export const updateLoginStatusAsync = createAsyncThunk(
  'auth/updateLoginStatusAsync',
  async (hideLoading: boolean, actions) => {
    let res = await getLoginStatus(hideLoading)
    return res.IsSuccess
  }
)
export const updateUserStatusAsync = createAsyncThunk(
  'auth/updateUserStatusAsync',
  async (hideLoading: boolean, actions) => {
    let res = await getUserStatus(hideLoading)
    return res.Result!
  }
)
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateLoginStatus: (state, status: PayloadAction<boolean>) => {
      state.loginStatus = status.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateLoginStatusAsync.fulfilled, (state, action) => {
      state.loginStatus = action.payload
    })
    builder.addCase(updateUserInfoAsync.fulfilled, (state, action) => {
      state.userInfo = action.payload
    })
    builder.addCase(updateUserStatusAsync.fulfilled, (state, action) => {
      if (action.payload) {
        state.status = action.payload
      }
    })
  },
})
export const { updateLoginStatus } = authSlice.actions
export default authSlice.reducer
