import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import settingsSlice from './modules/settings'
import routerSlice from './modules/router'
import authSlice from './modules/auth'
import converstaionSlice from './modules/converstaion'
export const store = configureStore({
  reducer: {
    settings: settingsSlice,
    router: routerSlice,
    auth: authSlice,
    chat: converstaionSlice,
  },
  middleware: (gDM) =>
    gDM({
      serializableCheck: false,
    }),
})

export const rootState: RootState = store.getState() as RootState
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export default store
