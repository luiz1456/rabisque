// // import React, { useRef } from 'react'
import { BottomMenu, Container } from './styled'
// // import { BlackboardProvider } from '../../context/blackboardContext'
// // import { PreviewLayer } from './components/previewLayer'
import { Toolsbar } from './components/toolsbar'
// // import { toolsbarContext } from '../../context/toolsbarContext'
// // import { DrawCanvas } from './components/drawCanvas'
import { Blackboard } from './components/blackboard'
import { BlackboardContainer } from './components/blackboardContainer'
import { useEffect, useRef, useState } from 'react'
// import { toolsbarContext } from '../../context/toolsbarContext'
// import { blackboardContext } from '../../context/blackboardContext'

export function Home() {
  const drawingLayer = useRef<HTMLCanvasElement>(null)
  const [drawingLayerContext, setDrawingLayerContext] =
    useState<CanvasRenderingContext2D | null>(null)
  const [drawing, setDrawing] = useState<boolean>(false)
  // const { blackboardSize } = useContext(blackboardContext)
  // const canvasRef = useRef<HTMLCanvasElement>(null)
  // const canvasContext = canvasRef.current?.getContext('2d', {
  //   willReadFrequently: true,
  // })

  // const transformedLineWidth = (100 * +lineWidth) / 100 // max line width = 50

  useEffect(() => {
    if (drawingLayer.current) {
      setDrawingLayerContext(
        drawingLayer.current.getContext('2d', {
          willReadFrequently: true,
        }),
      )
    }
  }, [])

  const handleMouseUp = () => {
    setDrawing(false)
    // if (
    //   drawingLayerContext &&
    //   blackboardSize &&
    //   activeTool === 'line' &&
    //   drawing
    // ) {
    //   const { width, height } = blackboardSize
    //   const newImageData = drawingLayerContext.getImageData(0, 0, width, height)
    //   setRestoreArray((prev) => [...prev, newImageData])
    // }
    // saveForm()
  }

  // function saveForm() {
  //   console.log('oi')
  //   if (
  //     drawingLayerContext &&
  //     blackboardSize &&
  //     activeTool !== 'line' &&
  //     initialCoordinate
  //   ) {
  //     console.log('entrou')
  //     const { width, height } = blackboardSize
  //     const newImageData = drawingLayerContext.getImageData(0, 0, width, height)
  //     setRestoreArray((prev) => [...prev, newImageData])
  //   }
  // }

  // const draw = (
  //   event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  // ) => {
  //   if (canvasContext) {
  //     if (activeEraser) {
  //       canvasContext.globalCompositeOperation = 'destination-out'
  //     } else {
  //       canvasContext.globalCompositeOperation = 'source-over'
  //       canvasContext.strokeStyle = lineColor
  //       canvasContext.lineCap = 'round'
  //       canvasContext.lineJoin = 'round'
  //     }
  //     if (canvasRef.current) {
  //       canvasContext.lineWidth = transformedLineWidth
  //       canvasContext.lineTo(coordinate.x, coordinate.y)
  //       canvasContext.stroke()
  //     }
  //   }
  // }
  // const startDrawing = (
  //   event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  // ) => {
  //   setDrawing(true)
  //   canvasContext?.beginPath()
  //   draw(event)
  // }

  // const handleMouseEnter = () => {
  //   canvasContext?.beginPath()
  // }

  // const handleDraw = (
  //   event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  // ) => {
  //   if (drawing) {
  //     draw(event)
  //   }
  // }

  // const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
  //   const element = event.target as HTMLAnchorElement
  //   if (canvasRef.current) {
  //     element.setAttribute('href', canvasRef.current.toDataURL())
  //     element.setAttribute('download', 'minha img')
  //   }
  // }

  return (
    <Container onMouseUp={handleMouseUp} onTouchEnd={handleMouseUp}>
      {/* <Toolsbar canvasContext={canvasContext} /> */}
      <Toolsbar drawingLayerContext={drawingLayerContext} />

      {/* <BlackboardProvider> */}
      {/* <div onMouseDown={startDrawing}>
          <DrawCanvas ref={canvasRef} />
          <PreviewLayer />
        </div> */}
      <BlackboardContainer>
        <Blackboard
          drawing={drawing}
          setDrawing={setDrawing}
          ref={drawingLayer}
          drawingLayerContext={drawingLayerContext}
        />
        {/* <h1>ola mundo</h1> */}
      </BlackboardContainer>
      {/* </BlackboardProvider> */}
      <BottomMenu>
        <a>baixar</a>
        {/* <a onClick={handleClick}>baixar</a> */}
      </BottomMenu>
    </Container>
  )
}
