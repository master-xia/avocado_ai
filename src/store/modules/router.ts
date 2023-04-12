import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState, AppThunk } from '@store'

export interface RouterState {
  /**不为空就重定向 */
  redirectUrl: string
}

const initialState: RouterState = {
  redirectUrl: '',
}
export const routerSlice = createSlice({
  name: 'router',
  initialState,
  reducers: {
    updateRediretUrl: (state, action: PayloadAction<string>) => {
      state.redirectUrl = action.payload
    },
  },
})
export const { updateRediretUrl } = routerSlice.actions
export const selectRedirectUrl = (state: RouterState) => state.redirectUrl
export default routerSlice.reducer
