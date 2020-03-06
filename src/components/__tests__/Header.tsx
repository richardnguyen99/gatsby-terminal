/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { shallow, mount } from 'enzyme'

import Header, { StyledClickableItem } from '../header'

const getDatetime = (): Date => new Date()

describe('<Header /> component', () => {
  it('renders', () => {
    mount(<Header />)
  })

  it('found <StyledClickableItem id="clock"/>', () => {
    const wrapper = mount(<Header />)

    expect(
      wrapper
        .find('#clock')
        .children()
        .find('p')
        .map(el => el.text())
    ).toEqual([new Date().toLocaleTimeString()])
  })
})
