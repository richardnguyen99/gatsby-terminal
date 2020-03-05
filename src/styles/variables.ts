/**
 * Create a set of global variables to avoid the pattern below:
 * <property>: ${(props): string => props.theme.mode === 'dark' ? <darkValue> : <lightValue> }
 * in every single `styled-components` function.
 *
 * Instead, use `var(<variables>)` to automatically update values due to
 * current theme. `light` is default.
 *
 * The naming rule of these variables is inspired from `BEM`: http://getbem.com/
 * --<block>__<element>--<modifer>-<state?>
 */

import { css } from 'styled-components'

const global = css`
  --body__text: ${(props): string =>
    props.theme.mode === 'dark' ? '#020202' : '#fafafa'};
  --body__background: ${(props): string =>
    props.theme.mode === 'dark' ? '#202020' : '#e0e0e0'};

  --terminal__text: ${(props): string =>
    props.theme.mode === 'dark' ? '#020202' : '#fafafa'};
  --terminal__background: ${(props): string =>
    props.theme.mode === 'dark' ? '#e0e0e0' : '#202020'};

  --body__boxshadow--focus-on: 0 0 1px rgba(0, 0, 0, 0.26),
    0 0 5px rgba(0, 0, 0, 0.16), 0 8px 10px rgba(0, 0, 0, 0.06),
    0 55px 65px rgba(0, 0, 0, 0.68);
  --body__boxshadow--focus-off: 0 0 1px rgba(0, 0, 0, 0.26),
    0 0 5px rgba(0, 0, 0, 0.16), 0 8px 10px rgba(0, 0, 0, 0.06),
    0 55px 65px rgba(0, 0, 0, 0);
`

export default global
