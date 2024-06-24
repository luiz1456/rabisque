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
    if (blackboardRef.current && setBlackboardSize) {
      setBlackboardSize({
        width: blackboardRef.current.offsetWidth,
        height: blackboardRef.current.offsetHeight,
      })
    }
  }, [setBlackboardSize, blackboardRef])

  useEffect(() => {
    if (blackboardRef.current) {
      blackboardRef.current.addEventListener(
        'touchmove',
        (event) => {
          event.preventDefault()
        },
        { passive: false },
      )
    }
  }, [blackboardRef])
  //   // setMapping(true)
  //   setinitialCoordinate(getCoordinate({ blackboardRef, event }))
  // }

  return (
    <Container
      // onMouseDown={handleMouseDown}
      // onTouchStart={handleMouseDown}
      // onTouchStart={startDrawing}
      // onTouchMove={handleDraw}
      style={{
        backgroundColor,
      }}
      ref={blackboardRef}
    >
      {children}
    </Container>
  )
}
