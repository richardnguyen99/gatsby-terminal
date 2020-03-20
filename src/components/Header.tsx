/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import Icon, { Octoface, Calendar, Gear, Clock } from '@primer/octicons-react'

import { ThemeContext } from '@context/ThemeContext'

interface HeaderProps {
  siteTitle?: string
}

const StyledNavbar = styled.nav`
  /* Declare position of navbar */
  position: fixed;
  top: 0;
  right: 0;
  left: 0;

  /* Use flex utilities for controlling alignments */
  display: flex;

  padding: 1rem;
`

export const StyledControllGroup = styled.ul`
  /* Use flex utilities to control alignments */
  display: flex;

  list-style: none;
  height: 100%;
  margin: 0;
  padding: 0;
`

const StyledControlBrandGroup = styled(StyledControllGroup)`
  flex: 1;
`

const StyledControlConfigGroup = styled(StyledControllGroup)`
  flex: 1;
  justify-content: flex-end;

  min-width: auto;
`

const StyledItem = styled.li`
  display: flex;
  align-items: center;

  font-family: 'SF Mono', Menlo, Monaco, monospace;
  font-size: 12px;
  font-weight: bold;

  border-radius: 4px;
  border: 1px solid #060606;

  color: var(--header__text--focus-off);
  background: var(--header__background--focus-off);

  padding: 0.5rem 1rem;

  box-shadow: 0 0 1px rgba(0, 0, 0, 0.26), 0 0 5px rgba(0, 0, 0, 0.16),
    0 8px 10px rgba(0, 0, 0, 0.06), 0 15px 65px rgba(0, 0, 0, 0.48);

  text-decoration: none;

  transition: all 100ms ease-in-out;

  &.active {
    background: var(--header__background--focus-on);
    color: var(--header__text--focus-on);
    border: none;
  }

  p {
    margin-top: 0;
    margin-right: 0;
    margin-left: 0.375rem;
    margin-bottom: 0;

    &:hover {
      cursor: default;
    }
  }
`

const StyledNav = styled.ul`
  display: flex;
  flex-direction: column;

  list-style: none;
  height: 100%;

  padding: 0rem;
`

const StyledNavItem = styled(StyledItem)`
  border: none;
  border-radius: 0px;
  box-shadow: none;

  padding: 0.5rem 1rem;

  &#source {
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
  }

  &#info {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  &:hover {
    background: var(--header__background--onHover);
  }

  a {
    text-decoration: none;

    &:visited {
      color: var(--header__text--focus-off);
    }
  }
`

interface StyledCollapseMenuProps {
  show: boolean
}

const StyledCollapseMenu = styled.div<StyledCollapseMenuProps>`
  flex-basis: 100%;
  flex-grow: 1;
  align-items: center;
  @media screen and (min-width: 992px) {
    display: inline-table;
    position: absolute;
    top: 60%;
    left: 0;
    right: 0;
    z-index: 1000;
    margin: 1rem;
    height: auto;
    border-radius: 8px;
    box-shadow: var(--body__boxshadow--focus-off);
    background: var(--header__background--focus-off);
    color: var(--header__background--focus-on);

    opacity: ${(props): number => (!props.show ? 0 : 1)};
  }
  display: ${(props): string => (!props.show ? `none` : ``)};
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const StyledClickableItem: React.FC<{ [a: string]: any }> = ({
  children,
  ...rest
}) => {
  const { as } = rest
  const ref = useRef<HTMLLIElement>(null)
  const [click, setClick] = useState(false)

  const handleClick = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ): void => {
    e.preventDefault()
    setClick(!click)
  }

  const handleClickOutSide = (e: MouseEvent): void => {
    // https://stackoverflow.com/questions/43842057/detect-if-click-was-inside-react-component-or-not-in-typescript
    if (click && ref.current && !ref.current.contains(e.target as Node)) {
      setClick(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutSide)

    return (): void => {
      document.removeEventListener('mousedown', handleClickOutSide)
    }
  }, [handleClickOutSide])

  return (
    <StyledItem
      as={as}
      ref={ref}
      className={click ? 'active' : ''}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </StyledItem>
  )
}

const ControlBandGroup: React.FC = () => {
  const ref = useRef<HTMLUListElement>(null)

  const [show, setShow] = useState(false)

  const themeContext = useContext(ThemeContext)

  const handleClick = (
    evt: React.MouseEvent<HTMLLIElement, MouseEvent>
  ): void => {
    evt.preventDefault()
    setShow(!show)
  }

  const handleClickOutSide = (e: MouseEvent): void => {
    // https://stackoverflow.com/questions/43842057/detect-if-click-was-inside-react-component-or-not-in-typescript
    if (show && ref.current && !ref.current.contains(e.target as Node)) {
      setShow(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutSide)

    return (): void => {
      document.removeEventListener('mousedown', handleClickOutSide)
    }
  }, [handleClickOutSide])

  return (
    <StyledControlBrandGroup id="brand" ref={ref}>
      <StyledClickableItem onClick={handleClick}>
        <Icon icon={Octoface} />
        <p>PortfoliOS</p>
      </StyledClickableItem>
      <StyledCollapseMenu show={show}>
        <StyledNav>
          <StyledNavItem id="source">
            <a href="https://github.com/richardnguyen99/portfolios">
              Source (Github)
            </a>
          </StyledNavItem>
          <StyledNavItem onClick={(): void => themeContext.toggle()}>
            Switch to&nbsp;
            {themeContext.theme === 'dark' ? 'light' : 'dark'}
          </StyledNavItem>
          <StyledNavItem id="info">Config</StyledNavItem>
        </StyledNav>
      </StyledCollapseMenu>
    </StyledControlBrandGroup>
  )
}

const Header: React.FC = () => {
  const [date, setDate] = useState(new Date())

  const convertDate = (inputDate: Date): string => {
    const weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]

    const weekday = weekdays[inputDate.getDay()]
    const month = months[inputDate.getMonth()]

    return `${weekday}, ${month} ${inputDate.getDate()}, ${inputDate.getFullYear()}`
  }

  useEffect(() => {
    const id = setInterval(() => setDate(new Date()), 1000)

    return (): void => {
      clearInterval(id)
    }
  }, [])

  return (
    <StyledNavbar>
      <ControlBandGroup />
      <StyledControllGroup id="date" style={{ flexShrink: 0 }}>
        <StyledClickableItem>
          <Icon icon={Calendar} />
          <p>{convertDate(date)}</p>
        </StyledClickableItem>
      </StyledControllGroup>
      <StyledControlConfigGroup id="util">
        <StyledClickableItem id="config" style={{ marginRight: '1rem' }}>
          <Icon icon={Gear} />
          <p>Config</p>
        </StyledClickableItem>
        <StyledClickableItem id="clock">
          <Icon icon={Clock} />
          <p>{date.toLocaleTimeString()}</p>
        </StyledClickableItem>
      </StyledControlConfigGroup>
    </StyledNavbar>
  )
}

export default Header
