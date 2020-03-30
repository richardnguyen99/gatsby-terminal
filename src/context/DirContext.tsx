/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useReducer, useEffect } from 'react'

import { useLocalStorage } from '@hooks'
import { createReducer } from '@utils'
import { NodeData } from '@utils/treeDir'

const initialStructure: NodeData = {
  name: 'root',
  children: [],
}

const currentDir = { name: '/root/' }

const initialState = {
  structure: initialStructure,
  currentDir,
}

type Payload = typeof initialState

type State = {
  type: string
  payload: Payload
}

const dirReducer = createReducer<Payload>(initialState, {
  CHANGE_DIR: (state, payload) => ({
    ...state,
    currentDir: payload.currentDir,
  }),
  MAKE_DIR: (state, payload) => ({
    ...state,
    structure: payload.structure,
  }),
})

export const DirContext = createContext<{
  state: Payload
  dispatch: React.Dispatch<State>
}>({
  state: initialState,
  dispatch: () => {},
})

const DirProvider: React.FC = ({ children }) => {
  const [dir, setDir] = useLocalStorage('dir', initialState)
  const [state, dispatch] = useReducer(dirReducer, dir)

  // Update localStorage after dispatch or state changes.
  useEffect(() => {
    setDir({ ...state })
  }, [state, dispatch])

  return (
    <DirContext.Provider value={{ state, dispatch }}>
      {children}
    </DirContext.Provider>
  )
}

export default DirProvider
