import { ReactNode, createContext, useRef, useState } from 'react'

export interface blackboardSizeType {
  width: number
  height: number
}

export interface CoordinateType {
  x: number
  y: number
}

interface blackboardContextType {
  blackboardSize: blackboardSizeType | null
  setBlackboardSize: React.Dispatch<
    React.SetStateAction<blackboardSizeType | null>
  >
  blackboardRef: React.RefObject<HTMLDivElement>
}

interface BlackboardProviderType {
  children: ReactNode
}

export const blackboardContext = createContext({} as blackboardContextType)

export function BlackboardProvider({ children }: BlackboardProviderType) {
  //   // const [mapping, setMapping] = useState<boolean>(false)
  const [blackboardSize, setBlackboardSize] =
    useState<null | blackboardSizeType>(null)
  //   // const blackBoardRef = useRef<HTMLDivElement>(null)
  const blackboardRef = useRef<HTMLDivElement>(null)
  //   // useEffect(() => {
  //   //   if (blackBoardRef.current && setBlackboardSize) {
  //   //     setBlackboardSize({
  //   //       width: blackBoardRef.current.offsetWidth,
  //   //       height: blackBoardRef.current.offsetHeight,
  //   //     })
  //   //   }
  //   // }, [setBlackboardSize])

  //   // function getCoordinate(event: TypeEventMouseOrTouch) {
  //   //   if (blackBoardRef.current) {
  //   //     const positionElement = blackBoardRef.current.getBoundingClientRect()
  //   //     const coordinate = {
  //   //       x:
  //   //         'touches' in event
  //   //           ? event.touches[0].clientX - positionElement.left
  //   //           : event.clientX - positionElement.left,
  //   //       y:
  //   //         'touches' in event
  //   //           ? event.touches[0].clientY - positionElement.top
  //   //           : event.clientY - positionElement.top,
  //   //     }
  //   //     return coordinate
  //   //   } else return null
  //   // }

  //   // function handleMouseDown(event: TypeEventMouseOrTouch) {
  //   //   setMapping(true)
  //   //   setinitialCoordinate(getCoordinate(event))
  //   //   setCurrentCoordinate(getCoordinate(event))
  //   // }

  //   // function handleMouseMove(event: TypeEventMouseOrTouch) {
  //   //   if (mapping) {
  //   //     setCurrentCoordinate(getCoordinate(event))
  //   //   }
  //   // }

  return (
    <blackboardContext.Provider
      value={{
        blackboardSize,
        setBlackboardSize,
        blackboardRef,
      }}
    >
      {children}
    </blackboardContext.Provider>
  )
}
