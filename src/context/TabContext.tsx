/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useReducer } from 'react'

import { createReducer } from '@utils'

const initialState = {
  number: 1,
  tabs: [
    {
      id: 1,
      type: 'terminal',
      isFocused: true,
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
  DELETED: (state, payload) => ({
    number: payload.number,
    tabs: payload.tabs,
  }),
})

const TabContext = createContext<{
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
