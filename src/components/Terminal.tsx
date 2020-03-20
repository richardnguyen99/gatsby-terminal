import React, { useState, useCallback, useRef, useEffect } from 'react'
import styled, {
  keyframes,
  css,
  FlattenSimpleInterpolation,
} from 'styled-components'

const blink = keyframes`
  0% { opacity: 1.0; }
  50% { opacity: 0.0; }
  100% { opacity: 1.0; }
`

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
  display: block;
  padding: 0.5rem;

  font-family: 'SF Mono', Monaco, Menlo, monospace;
  font-weight: normal;
  font-size: 14px;

  color: var(--terminal__text);
  background: var(--terminal__background);

  margin: 0;

  height: 100%;

  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;

  outline: none;
  overflow-y: scroll;
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

const StyledTerminal = styled.div`
  display: block;

  position: absolute;
  z-index: -1;

  width: 640px;
  height: 280px;

  border-radius: 5px;

  box-shadow: var(--body__boxshadow--focus-on);

  &.active {
    box-shadow: var(--body__boxshadow--focus-off);
  }
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

const Terminal: React.FC = () => {
  const [state, setState] = useState({
    isDragging: false,
    dX: 80,
    dY: 80,
  })

  const [click, setClick] = useState(false)
  const [text, setText] = useState('')
  const [prompt, setPrompt] = useState('portfoliOS@~ root$ ')
  const [commandString, setCommandString] = useState('')
  const [position, setPosition] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const focusRef = useRef<HTMLDivElement>(null)

  const keyArrowEvents = ['keyup', 'keydown', 'keypress']

  const handleScrolling = (): void => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault()
    if (!click) {
      setClick(true)
    }
  }

  const handleClickOutSide = (e: MouseEvent): void => {
    // https://stackoverflow.com/questions/43842057/detect-if-click-was-inside-react-component-or-not-in-typescript
    if (
      click &&
      focusRef.current &&
      !focusRef.current.contains(e.target as Node)
    ) {
      setClick(false)
    }
  }

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
    setCommandString(evt.target.value)
    setPosition(Number(inputRef.current?.selectionStart))
  }

  const handleKeyPress = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      const parsedCommand = commandString.split(' ')

      if (parsedCommand[0] === 'clear') {
        setText(``)
      } else if (parsedCommand[0] === 'echo') {
        setText(`${text}\n${parsedCommand.slice(1).join(' ')}\n`)
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
  }

  const onMouseMove = useCallback(
    e => {
      if (state.isDragging) {
        setState(prevState => ({
          ...prevState,
          dX: prevState.dX + e.movementX,
          dY: prevState.dY + e.movementY,
        }))
      }
    },
    [state.isDragging]
  )

  const onMouseDown = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      isDragging: true,
    }))
  }, [])

  const onMouseUp = useCallback(() => {
    if (state.isDragging) {
      setState(prevState => ({
        ...prevState,
        isDragging: false,
      }))
    }
  }, [state.isDragging])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return (): void => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  useEffect(() => {
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
          setPosition(Number(inputRef.current?.selectionStart))
        })
      )

      document.removeEventListener('keypress', handleKeyPress)
    }
  }, [handleKeyPress])

  useEffect(handleScrolling, [text])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutSide)

    return (): void => {
      document.removeEventListener('mousedown', handleClickOutSide)
    }
  }, [handleClickOutSide])

  return (
    <StyledTerminal
      ref={focusRef}
      onClick={handleClick}
      className={!click ? 'active' : ''}
      style={{
        left: `${state.dX.toString().concat('px')}`,
        top: `${state.dY.toString().concat('px')}`,
      }}
    >
      <StyledHeading onMouseDown={onMouseDown}>
        <StyledBtnContainer>
          <StyledBtnRed className={!click ? 'deactive' : ''} />
          <StyledBtnYellow className={!click ? 'deactive' : ''} />
          <StyledBtnGreen className={!click ? 'deactive' : ''} />
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
