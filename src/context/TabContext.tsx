/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useReducer } from 'react'

import { createReducer, generateID } from '@utils'

const initialState = {
  number: 1,
  tabs: [
    {
      id: generateID(),
      type: 'terminal',
      isFocused: true,
      isMaximized: false,
    },
  ],
}

type Payload = typeof initialState
type State = {
  type: string
  payload: Payload
}

const tabReducer = createReducer<Payload>(initialState, {
  ON_FOCUSED: (state, payload) => ({
    ...state,
    tabs: payload.tabs,
  }),
  ON_MAXIMIZED: (state, payload) => ({
    ...state,
    tabs: payload.tabs,
  }),
  CREATED: (state, payload) => ({
    ...state,
    number: payload.number,
    tabs: payload.tabs,
  }),
  DELETED: (state, payload) => ({
    ...state,
    number: payload.number,
    tabs: payload.tabs,
  }),
})

export const TabContext = createContext<{
  state: Payload
  dispatch: React.Dispatch<State>
}>({
  state: initialState,
  dispatch: () => {},
})

const TabProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(tabReducer, initialState)

  return (
    <TabContext.Provider value={{ state, dispatch }}>
      {children}
    </TabContext.Provider>
  )
}

export default TabProvider
