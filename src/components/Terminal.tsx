import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useContext,
  useReducer,
} from 'react'
import styled, { css, FlattenSimpleInterpolation } from 'styled-components'

import { DirContext } from '@context/DirContext'
import { TabContext } from '@context/TabContext'
import { TreeDir } from '@/utils'

const StyledBtn = styled.button`
  border-radius: 50%;
  border: none;

  width: 14px;
  height: 14px;

  padding: 0;
  margin-right: 0.5rem;

  &.deactive {
    background: rgba(142, 142, 147, 1);
  }
`

const StyledBtnRed = styled(StyledBtn)`
  background: rgba(255, 59, 48, 1);
`

const StyledBtnYellow = styled(StyledBtn)`
  background: rgba(255, 204, 0, 1);
`

const StyledBtnGreen = styled(StyledBtn)`
  background: rgba(40, 205, 65);
`

const StyledBtnContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  position: absolute;
`

const StyledTitle = styled.h1`
  margin: 0 auto;

  color: var(--terminal__text);
  line-height: 1;
  height: 12px;

  font-family: --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 12px;
  font-weight: 400;
`

const StyledHeading = styled.div`
  display: flex;

  position: relative;

  margin: 0;
  padding: 0.375rem;

  color: var(--terminal__text);
  background: var(--terminal__background);

  width: auto;

  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

  box-sizing: border-box;
`

const StyledConsole = styled.p`
  padding: 0.5rem;

  font-family: 'SF Mono', Monaco, Menlo, monospace;
  font-weight: normal;
  font-size: 14px;

  color: var(--terminal__text);
  background: var(--terminal__background);

  height: 92%;

  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;

  outline: none;
  overflow-y: hidden;
  overflow-x: hidden;
  word-break: break-word;
  overflow-wrap: break-word;

  &::-webkit-scrollbar {
    width: 10px;
    border-radius: 50%;
  }

  &::-webkit-scrollbar-track {
    border: 1px solid #000;
    padding: 2px 0;
    background-color: #404040;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #737272;
    border: 1px solid #000;
  }
`

const StyledInput = styled.input`
  z-index: -1;

  font-family: 'SF Mono', monospace;
  font-weight: bold;

  background: var(--terminal__background);
  color: var(--terminal__text);

  border: none;
  outline: none;

  padding-left: 0.5rem;
`

const StyledPrompt = styled.span`
  font-family: 'SF Mono', monospace;
  font-weight: bold;

  background: var(--terminal__background);
  color: var(--terminal__text);

  padding-right: 0.5rem;
`

const StyledCommandLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`

interface StyledTerminalProps {
  isMax: boolean
}

const StyledTerminal = styled.div<StyledTerminalProps>`
  display: block;

  position: absolute;
  z-index: -1;

  background: var(--terminal__background);

  border-radius: 5px;

  box-shadow: var(--body__boxshadow--focus-on);

  &.active {
    box-shadow: var(--body__boxshadow--focus-off);
  }

  /*transition: all 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275);*/
`

const StyledCaret = styled.span<{ blinked?: boolean }>`
  color: var(--terminal__text);

  ${(props): FlattenSimpleInterpolation =>
    props.blinked
      ? css`
          background: var(--terminal__background);
          color: var(--terminal__background);

          #char {
            background: var(--terminal__background);
            color: var(--terminal__text);
          }
        `
      : css`
          background: var(--terminal__text);

          #char {
            background: var(--terminal__text);
            color: var(--terminal__background);
          }
        `}
`

const Caret: React.FC = ({ children }) => {
  const [blinked, setBlinked] = useState(false)

  const caretWithChar =
    typeof children === 'undefined' ? (
      'C'
    ) : (
      <StyledCaret id="char" blinked={blinked}>
        {children}
      </StyledCaret>
    )

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinked(!blinked)
    }, 550)

    return (): void => {
      clearInterval(interval)
    }
  })

  return <StyledCaret blinked={blinked}>{caretWithChar}</StyledCaret>
}

interface TerminalProps {
  id: string
  isMax: boolean
  initial?: {
    width?: number
    height?: number
    top?: number
    left?: number
  }
}

const Terminal: React.FC<TerminalProps> = ({ id, initial, isMax }) => {
  const dirContext = useContext(DirContext)
  const tabContext = useContext(TabContext)

  // The structure got from DirContext is from localStorage.
  // But it's unable to set a class to localStorage, so an object
  // is substituted.To use Tree methods like add, remove and search
  // outside a class is arduous
  const dir = new TreeDir(dirContext.state.structure)
  const currentDir = dirContext.state.currentDir.name
    .split('/')
    .filter(Boolean)
    .slice(-1)
    .toString()

  // Main state contains core values to manipulate the component's
  // size and position.
  const [state, setState] = useState({
    width: initial && initial.width ? initial.width : 860,
    height: initial && initial.height ? initial.height : 480,
    top: initial && initial.top ? initial.top : 20,
    left: initial && initial.left ? initial.left : 20,
  })

  // Check if the mouse hits the edges or the corners of componnent.
  const [hit, setHit] = useState({
    top: false,
    right: false,
    bottom: false,
    left: false,
  })

  // Store mouse position and modify its cursor style basing on
  // hit state.
  const [cursor, setCursor] = useState({
    posX: 0,
    posY: 0,
    style: 'auto',
  })

  // Store state of click event to know when terminal is selected.
  const [selected, setSelected] = useState(false)

  // Contains state when clicking on edges and get values at that moment.
  // If click while not on edges, clicked is null.
  const [clicked, setClicked] = useState<{
    x: number
    y: number
    top: number
    left: number
    boundingBox: DOMRect
  } | null>(null)

  // Text is used as a log. It will store everything clients type and format
  // them so that it can be read easily. To clean this up, use `clear` command
  // in the terminal will set it back to empty string.
  const [text, setText] = useState('')

  // Display prompt. Can be changed based on the current dir.
  const [prompt, setPrompt] = useState(
    // Seperate directories by / and make sure it's always the last element.
    `portfoliOS@${currentDir} root$ `
  )

  // Store client's input before hit enter. After hit Enter, terminal will
  // check if it is a valid command and will process. This will be also set
  // to empty string.
  const [commandString, setCommandString] = useState('')

  // Store current position in client's input. Can be changed by using
  // the arrow keys to move around.
  const [position, setPosition] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  // Force update component.
  // https://stackoverflow.com/a/58606536/12915739
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void

  // Make sure terminal always follow to the last command.
  const handleScrolling = (): void => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Handle when users click on the component.
  const handleClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault()
    if (!selected) {
      setSelected(true)
    }
  }

  // Handle when users click outside the component
  const handleClickOutSide = useCallback((e: MouseEvent): void => {
    // https://stackoverflow.com/questions/43842057/detect-if-click-was-inside-react-component-or-not-in-typescript
    if (
      terminalRef.current &&
      !terminalRef.current.contains(e.target as Node)
    ) {
      setSelected(false)
    }
  }, [])

  const renderCaret = (): Array<string | JSX.Element> => {
    const commandStringCaret: Array<string | JSX.Element> = commandString.split(
      ''
    )

    commandStringCaret.splice(
      position,
      1,
      <Caret>{commandString[position]}</Caret>
    )

    return commandStringCaret
  }

  const handleSelect = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    // eslint-disable-next-line no-param-reassign
    evt.target.selectionStart = evt.target.selectionEnd
  }

  const handleInputChange = (
    evt: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setCommandString(evt.target.value === ' ' ? '&nbsp;' : evt.target.value)
    setPosition(Number(inputRef.current?.selectionStart))
  }

  const handleKeyPress = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === 'Enter') {
        const parsedCommand = commandString.split(' ')

        if (parsedCommand[0] === 'clear') {
          setText(``)
        } else if (parsedCommand[0] === 'echo') {
          setText(`${text}\n${parsedCommand.slice(1).join(' ')}\n`)
        } else if (parsedCommand[0] === 'mkdir') {
          try {
            dir.add(
              {
                name: parsedCommand[1],
                children: [],
              },
              { name: currentDir }
            )
            dirContext.dispatch({
              type: 'MAKE_DIR',
              payload: {
                ...dirContext.state,
                structure: dir.root,
              },
            })
            setText(`${text}\n${prompt} ${commandString}\n`)
          } catch (error) {
            setText(`${text}\n${prompt} ${commandString}\n${error}\n`)
          }
        } else if (parsedCommand[0] === 'cd') {
          if (!parsedCommand[1]) {
            setText(
              `${text}\n${prompt} ${commandString}\n${dirContext.state.currentDir.name}\n`
            )
          } else {
            const node = dir.bfs({ name: currentDir })

            if (node !== null) {
              const children = node.children.map(({ name }) => name)

              if (children.includes(parsedCommand[1])) {
                dirContext.dispatch({
                  type: 'CHANGE_DIR',
                  payload: {
                    ...dirContext.state,
                    currentDir: {
                      name: `${dirContext.state.currentDir.name}${parsedCommand[1]}/`,
                    },
                  },
                })
                setText(`${text}\n${prompt} ${commandString}\n`)
              } else if (parsedCommand[1] === '..') {
                if (currentDir !== 'root') {
                  dirContext.dispatch({
                    type: 'CHANGE_DIR',
                    payload: {
                      ...dirContext.state,
                      currentDir: {
                        name: dirContext.state.currentDir.name.replace(
                          `${currentDir}/`,
                          ''
                        ),
                      },
                    },
                  })
                  setText(`${text}\n${prompt} ${commandString}\n`)
                } else {
                  setText(
                    `${text}\n${prompt} ${commandString}\nYou are in root. Cannot go back anymore.\n`
                  )
                }
              } else {
                setText(
                  `${text}\n${prompt} ${commandString}\n${parsedCommand[1]} does not exist in ${currentDir}`
                )
              }
            }
          }
        } else if (parsedCommand[0] === 'sysinfo') {
          if (parsedCommand[1] === '--author' || parsedCommand[1] === '-a') {
            setText(`${text}\n${prompt} ${commandString}\nRichard Nguyen\n`)
          } else {
            setText(
              `${text}\n${prompt} ${commandString}\nAuthor: Richard Nguyen\nLanguage: Typescript\nFramework: Gatsby, Styled-components\nRepository: https//github.com/richardnguyen99/portfolios\n`
            )
          }
        } else {
          setText(
            `${text}\n${prompt} ${commandString}\n${parsedCommand[0]}: Command not found\n`
          )
        }
        setCommandString('')
        setPosition(0)
      }
    },
    [commandString, currentDir, dirContext, prompt, text, dir]
  )

  const onDelete = (): void => {
    tabContext.dispatch({
      type: 'DELETED',
      payload: {
        number: tabContext.state.number + 1,
        tabs: tabContext.state.tabs.filter(tab => tab.id !== id),
      },
    })
  }

  const minimize = (): void => {
    if (isMax) {
      const updateTabs = tabContext.state.tabs.map(tab =>
        tab.id === id ? { ...tab, isMaximized: false } : tab
      )

      tabContext.dispatch({
        type: 'ON_MAXIMIZED',
        payload: {
          ...tabContext.state,
          tabs: updateTabs,
        },
      })
    }
  }

  const maximize = (): void => {
    if (!isMax) {
      const updateTabs = tabContext.state.tabs.map(tab =>
        tab.id === id ? { ...tab, isMaximized: true } : tab
      )

      tabContext.dispatch({
        type: 'ON_MAXIMIZED',
        payload: {
          ...tabContext.state,
          tabs: updateTabs,
        },
      })
    }
  }

  const updateCursor = useCallback(
    (e: MouseEvent): void => {
      const boundingBox = terminalRef.current?.getBoundingClientRect()

      setCursor(prevState => ({
        ...prevState,
        posX: e.clientX,
        posY: e.clientY,
      }))

      if (boundingBox) {
        const hitTop = cursor.posY <= boundingBox.top + 10
        const hitBottom = cursor.posY >= boundingBox.bottom - 10
        const hitLeft = cursor.posX <= boundingBox.left + 10
        const hitRight = cursor.posX >= boundingBox.right - 10

        setCursor(prevState => ({
          ...prevState,
          style: 'auto',
        }))

        if (hitTop || hitBottom || hitLeft || hitRight) {
          if (hitRight && hitTop) {
            setCursor(prevState => ({
              ...prevState,
              style: 'ne-resize',
            }))
          } else if (hitRight && hitBottom) {
            setCursor(prevState => ({
              ...prevState,
              style: 'se-resize',
            }))
          } else if (hitLeft && hitTop) {
            setCursor(prevState => ({
              ...prevState,
              style: 'nw-resize',
            }))
          } else if (hitLeft && hitBottom) {
            setCursor(prevState => ({
              ...prevState,
              style: 'sw-resize',
            }))
          } else if (hitTop || hitBottom) {
            setCursor(prevState => ({
              ...prevState,
              style: 'ns-resize',
            }))
          } else if (hitLeft || hitRight) {
            setCursor(prevState => ({
              ...prevState,
              style: 'ew-resize',
            }))
          }
          e.stopPropagation()
        } else {
          const titleBoundingRect = titleRef.current?.getBoundingClientRect()

          if (
            titleBoundingRect &&
            cursor.posX > titleBoundingRect.left &&
            cursor.posY < titleBoundingRect.right &&
            cursor.posY > titleBoundingRect.top &&
            cursor.posY < titleBoundingRect.bottom
          ) {
            setCursor(prevState => ({
              ...prevState,
              style: 'move',
            }))
          }
        }

        setHit({
          top: hitTop,
          right: hitRight,
          bottom: hitBottom,
          left: hitLeft,
        })
      }
    },
    [cursor.posX, cursor.posY]
  )

  const onMouseMove = useCallback(
    (e: MouseEvent): void => {
      updateCursor(e)

      if (clicked !== null) {
        forceUpdate()
      }
    },
    [clicked, updateCursor, forceUpdate]
  )

  const onMouseDown = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    const boundingBox = terminalRef.current?.getBoundingClientRect()

    if (boundingBox && terminalRef.current) {
      setClicked({
        x: e.clientX,
        y: e.clientY,
        boundingBox,
        top: terminalRef.current.offsetTop,
        left: terminalRef.current.offsetLeft,
      })
    }
  }

  const onMouseUp = useCallback(
    (e: MouseEvent): void => {
      setClicked(null)
      updateCursor(e)
    },
    [updateCursor]
  )
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return (): void => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  useEffect(() => {
    if (clicked) {
      const { top, right, bottom, left } = hit
      const { boundingBox } = clicked

      if (top || left || right || bottom) {
        if (right)
          setState(prevState => ({
            ...prevState,
            width: Math.max(cursor.posX - boundingBox.left, 280),
          }))
        if (bottom)
          setState(prevState => ({
            ...prevState,
            height: Math.max(cursor.posY - boundingBox.top, 280),
          }))
        if (top) {
          const currentHeight = boundingBox.bottom - cursor.posY
          if (currentHeight > 280) {
            setState(prevState => ({
              ...prevState,
              height: currentHeight,
              top: clicked.top + cursor.posY - clicked.y,
            }))
          }
        }
        if (left) {
          const currentWidth = boundingBox.right - cursor.posX
          if (currentWidth > 280) {
            setState(prevState => ({
              ...prevState,
              width: currentWidth,
              left: clicked.left + cursor.posX - clicked.x,
            }))
          }
        }
      } else if (cursor.style === 'move' && !isMax) {
        setState(prevState => ({
          ...prevState,
          top: clicked.top + cursor.posY - clicked.y,
          left: clicked.left + cursor.posX - clicked.x,
        }))
      }
    }
  }, [clicked, cursor.posX, cursor.posY, cursor.style, hit, isMax])

  useEffect(() => {
    const keyArrowEvents = ['keyup', 'keydown', 'keypress']
    const interval = setInterval(() => inputRef.current?.focus(), 500)

    keyArrowEvents.map(evt =>
      document.addEventListener(evt, () => {
        setPosition(Number(inputRef.current?.selectionStart))
      })
    )

    document.addEventListener('keypress', handleKeyPress)

    return (): void => {
      clearInterval(interval)

      keyArrowEvents.map(evt =>
        document.removeEventListener(evt, () => {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          setPosition(Number(inputRef.current?.selectionStart))
        })
      )

      document.removeEventListener('keypress', handleKeyPress)
    }
  }, [handleKeyPress])

  useEffect(handleScrolling, [text])

  useEffect(() => {
    setPrompt(`portfoliOS@${currentDir} root$ `)
  }, [dirContext.state, currentDir])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutSide)

    return (): void => {
      document.removeEventListener('mousedown', handleClickOutSide)
    }
  }, [handleClickOutSide])

  return (
    <StyledTerminal
      id={`${id}`}
      ref={terminalRef}
      onClick={handleClick}
      onMouseDown={onMouseDown}
      isMax={isMax}
      className={!selected ? 'active' : ''}
      style={{
        left: isMax ? 0 : `${state.left}px`,
        right: isMax ? 0 : undefined,
        top: isMax ? 50 : `${state.top}px`,
        width: isMax ? undefined : `${state.width}px`,
        height: isMax ? '85vh' : `${state.height}px`,
        margin: !isMax ? undefined : '1rem',
        cursor: cursor.style,
      }}
    >
      <StyledHeading onMouseDown={onMouseDown} ref={titleRef}>
        <StyledBtnContainer>
          <StyledBtnRed
            className={!selected ? 'deactive' : ''}
            onClick={onDelete}
          />
          <StyledBtnYellow
            className={!selected ? 'deactive' : ''}
            onClick={minimize}
          />
          <StyledBtnGreen
            className={!selected ? 'deactive' : ''}
            onClick={maximize}
          />
        </StyledBtnContainer>
        <StyledTitle>Children</StyledTitle>
      </StyledHeading>
      <StyledConsole>
        {text !== '' &&
          text.includes('\n') &&
          text.split('\n').map(i => {
            return <div>{`${i}`}</div>
          })}
        <StyledCommandLine>
          <StyledPrompt>{prompt}</StyledPrompt>
          {renderCaret()}
          <StyledInput
            ref={inputRef}
            type="text"
            autoFocus
            onChange={handleInputChange}
            onSelect={handleSelect}
            value={commandString}
          />
        </StyledCommandLine>

        <div ref={scrollRef} />
      </StyledConsole>
    </StyledTerminal>
  )
}

export default Terminal
