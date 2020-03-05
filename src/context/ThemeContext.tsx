/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

import React, { createContext } from 'react'
import { ThemeProvider as ThemeRoot } from 'styled-components'

import { useLocalStorage } from '@hooks'

const ThemeContext = createContext({
  theme: 'light',
  toggle: (_: 'light' | 'dark') => {},
})

const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light')

  const themeObj = {
    mode: theme,
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle: setTheme }}>
      <ThemeRoot theme={themeObj}>{children}</ThemeRoot>
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
