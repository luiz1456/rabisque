import { ReactNode, useContext, useEffect } from 'react'
import { Container } from './styles'

import { blackboardContext } from '../../../../context/blackboardContext'
import { toolsbarContext } from '../../../../context/toolsbarContext'

interface BlackboardContainerProps {
  children: ReactNode
}

export function BlackboardContainer({ children }: BlackboardContainerProps) {
  const { setBlackboardSize, blackboardRef } = useContext(blackboardContext)
  const { backgroundColor } = useContext(toolsbarContext)

  useEffect(() => {
    if (blackboardRef.current) {
      if (setBlackboardSize) {
        setBlackboardSize({
          width: blackboardRef.current.offsetWidth,
          height: blackboardRef.current.offsetHeight,
        })
      }

      const handleTouchMove = (event: TouchEvent) => {
        event.preventDefault()
      }

      blackboardRef.current.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      })
    }
  }, [setBlackboardSize, blackboardRef])

  return (
    <Container style={{ backgroundColor }} ref={blackboardRef}>
      {children}
    </Container>
  )
}
