import React from 'react'
import styled from 'styled-components'

const StyledTab = styled.div`
  position: absolute;

  width: 100%;

  margin: auto;
`

interface ErrorProps {
  error: string
}

const Error: React.FC<ErrorProps> = ({ error }) => {
  return <StyledTab>{error}</StyledTab>
}

export default Error
