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
  const [blackboardSize, setBlackboardSize] =
    useState<null | blackboardSizeType>(null)
  const blackboardRef = useRef<HTMLDivElement>(null)

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
