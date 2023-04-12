import { getAvocadaInfoVM } from '@api/cmmon'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FooterStatus {
  isShow: boolean
  activeKey: string
}

export interface SettingsState {
  footerStatus: FooterStatus
  /**系统设置信息 */
  settings?: ISettings
  avocadoInfo: AvocadoInfoVM | undefined
}

interface ISettings {}
const initialState: SettingsState = {
  footerStatus: {
    isShow: false,
    activeKey: '',
  },
  avocadoInfo: undefined,
}
export const updateAvocadoInfoAsyn = createAsyncThunk(
  '/settings/updateAvocadoInfoAsyn',
  async (action) => {
    var res = await getAvocadaInfoVM()
    return res.Result
  }
)
export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateFooterStatus: (state, action: PayloadAction<FooterStatus>) => {
      state.footerStatus = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateAvocadoInfoAsyn.fulfilled, (state, payload) => {
      state.avocadoInfo = payload.payload
    })
  },
})
export const { updateFooterStatus } = settingsSlice.actions
export default settingsSlice.reducer
