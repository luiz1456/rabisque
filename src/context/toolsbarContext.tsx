import React, { ReactNode, createContext, useState } from 'react'
import { CoordinateType } from './blackboardContext'

type ActiveToolType =
  | 'line'
  | 'eraser'
  | 'square'
  | 'circle'
  | 'straightLine'
  | 'lineWithDots'
  | 'fill'

interface fillShapeType {
  square: boolean
  circle: boolean
}

interface toolsbarContextType {
  lineColor: string
  setLineColor: React.Dispatch<React.SetStateAction<string>>
  backgroundColor: string
  setBackgroundColor: React.Dispatch<React.SetStateAction<string>>
  restoreArray: ImageData[]
  setRestoreArray: React.Dispatch<React.SetStateAction<ImageData[]>>
  lineWidth: string
  transformedLineWidth: number
  setLineWidth: React.Dispatch<React.SetStateAction<string>>
  activeTool: ActiveToolType
  setActiveTool: React.Dispatch<React.SetStateAction<ActiveToolType>>
  fillShape: fillShapeType
  setFillShape: React.Dispatch<React.SetStateAction<fillShapeType>>
  lineWithDotsCoordinates: CoordinateType[]
  setLineWithDotsCoordinates: React.Dispatch<
    React.SetStateAction<CoordinateType[]>
  >
}

export const toolsbarContext = createContext({} as toolsbarContextType)

interface ToolsbarProviderProps {
  children: ReactNode
}

export function ToolsbarProvider({ children }: ToolsbarProviderProps) {
  const [restoreArray, setRestoreArray] = useState<ImageData[]>([])
  const [activeTool, setActiveTool] = useState<ActiveToolType>('line')
  const [fillShape, setFillShape] = useState<fillShapeType>({
    square: false,
    circle: false,
  })
  const [lineWidth, setLineWidth] = useState('20')
  const transformedLineWidth = (70 * (+lineWidth + 5)) / 100
  const [lineColor, setLineColor] = useState<string>('#000000')
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff')
  const [lineWithDotsCoordinates, setLineWithDotsCoordinates] = useState<
    CoordinateType[]
  >([])

  return (
    <toolsbarContext.Provider
      value={{
        activeTool,
        setActiveTool,
        lineColor,
        setLineColor,
        backgroundColor,
        setBackgroundColor,
        setRestoreArray,
        restoreArray,
        lineWidth,
        transformedLineWidth,
        setLineWidth,
        lineWithDotsCoordinates,
        setLineWithDotsCoordinates,
        fillShape,
        setFillShape,
      }}
    >
      {children}
    </toolsbarContext.Provider>
  )
}
