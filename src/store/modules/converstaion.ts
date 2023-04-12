import { getAllCategoryInfoVM, getLastConversationInfoVM } from '@api/chat'
import { getMessageCost } from '@api/cmmon'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ConversationState {
  conversationInfoVM: ConversationInfoVM | undefined | null
  categoryList: CategoryInfoVM[] | undefined
}

const initialState: ConversationState = {
  conversationInfoVM: undefined,
  categoryList: undefined,
}
export const updateCategoryListVMAsync = createAsyncThunk(
  '/converstaion/updateCategoryListVMAsync',
  async (action) => {
    var res = await getAllCategoryInfoVM()
    return res.Result
  }
)
export const updateConversationInfoAsync = createAsyncThunk(
  '/converstaion/updateConversationInfoAsync',
  async (action) => {
    var res = await getLastConversationInfoVM()
    return res.Result
  }
)

export const converstaionSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateConversationInfoAsync.fulfilled, (state, payload) => {
      state.conversationInfoVM = payload.payload
    })
    builder.addCase(updateCategoryListVMAsync.fulfilled, (state, payload) => {
      state.categoryList = payload.payload
    })
  },
})
export const {} = converstaionSlice.actions
export default converstaionSlice.reducer
