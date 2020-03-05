import 'styled-components'

type Theme = 'light' | 'dark'

declare module 'styled-components' {
  interface DefaultTheme {
    mode: Theme
  }
}
