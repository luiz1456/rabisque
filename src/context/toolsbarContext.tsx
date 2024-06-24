import React, { ReactNode, createContext, useState } from 'react'

type ActiveToolType =
  | 'line'
  | 'eraser'
  | 'square'
  | 'circle'
  | 'straightLine'
  | 'lineWithDots'
  | 'fill'

interface toolsbarContextType {
  lineColor: string
  setLineColor: React.Dispatch<React.SetStateAction<string>>
  backgroundColor: string
  setBackgroundColor: React.Dispatch<React.SetStateAction<string>>
  restoreArray: ImageData[]
  setRestoreArray: React.Dispatch<React.SetStateAction<ImageData[]>>
  lineWidth: string
  setLineWidth: React.Dispatch<React.SetStateAction<string>>
  activeTool: ActiveToolType
  setActiveTool: React.Dispatch<React.SetStateAction<ActiveToolType>>
}

export const toolsbarContext = createContext({} as toolsbarContextType)

interface ToolsbarProviderProps {
  children: ReactNode
}

export function ToolsbarProvider({ children }: ToolsbarProviderProps) {
  const [restoreArray, setRestoreArray] = useState<ImageData[]>([])
  const [activeTool, setActiveTool] = useState<ActiveToolType>('line')
  const [lineWidth, setLineWidth] = useState('20')
  const [lineColor, setLineColor] = useState<string>('#000000')
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff')

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
        setLineWidth,
      }}
    >
      {children}
    </toolsbarContext.Provider>
  )
}
