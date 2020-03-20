/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

import React, { createContext } from 'react'
import { ThemeProvider as ThemeRoot } from 'styled-components'

import { useLocalStorage } from '@hooks'

export const ThemeContext = createContext({
  theme: 'light',
  toggle: () => {},
})

const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light')

  const themeObj = {
    mode: theme,
  }

  const toggle = (): void => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <ThemeRoot theme={themeObj}>{children}</ThemeRoot>
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
