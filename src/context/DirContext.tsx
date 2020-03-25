/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useReducer } from 'react'

import { createReducer } from '@utils'

const initialState = {
  dir: '~',
}

const dirReducer = createReducer<typeof initialState>(initialState, {
  CHANGE_DIR: (state, payload) => ({ ...state, dir: `${payload.dir}` }),
})

export const DirContext = createContext<{
  state: typeof initialState
  dispatch: React.Dispatch<{ type: string; payload: typeof initialState }>
}>({
  state: initialState,
  dispatch: () => {},
})

const DirProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(dirReducer, initialState)

  return (
    <DirContext.Provider value={{ state, dispatch }}>
      {children}
    </DirContext.Provider>
  )
}

export default DirProvider
