import { useContext, useEffect, useRef, useState } from 'react'
import {
  CoordinateType,
  blackboardContext,
} from '../../../../context/blackboardContext'
import { toolsbarContext } from '../../../../context/toolsbarContext'
import { getCoordinate } from '../../utils/getCoordinates'
import { getPixelColor } from '../../utils/getPixelColor'
import { hexToRgba } from '../../utils/hexToRgba'
import { colorsMatch } from '../../utils/colorsMatch'
import { setPixelColor } from '../../utils/setPixelColor'
import { CanvasContextsType } from '../..'
import { clearPreviewContext } from '../../utils/clearPreviewContext'
import { lineWithDots } from '../../utils/lineWithDots'

export type TypeEventMouseOrTouch =
  | React.MouseEvent<HTMLDivElement>
  | React.TouchEvent<HTMLDivElement>
  | MouseEvent
  | TouchEvent

export type ColorTypeRgba = number[]

interface FillPointType {
  point: CoordinateType
  targetColor: ColorTypeRgba
  fillColor: ColorTypeRgba | null
}

interface BlackboardProps {
  setCanvasContexts: React.Dispatch<
    React.SetStateAction<CanvasContextsType | null>
  >
  saveImageData: () => void
}

export function Blackboard({
  setCanvasContexts,
  saveImageData,
}: BlackboardProps) {
  const { blackboardSize, blackboardRef } = useContext(blackboardContext)
  const {
    transformedLineWidth,
    lineColor,
    activeTool,
    fillShape,
    lineWithDotsCoordinates,
    setLineWithDotsCoordinates,
    restoreArray,
  } = useContext(toolsbarContext)

  const previewLayerRef = useRef<HTMLCanvasElement>(null)
  const previewLayerContext = previewLayerRef.current?.getContext('2d')

  const [isEditingCoordinate, setIsEditingCoordinate] = useState<boolean>(false)
  const [selectedCoordinateIndex, setSelectedCoordinateIndex] = useState<
    number | null
  >(null)

  const [initialCoordinate, setinitialCoordinate] =
    useState<CoordinateType | null>(null)
  const [drawing, setDrawing] = useState<boolean>(false)

  const drawingLayer = useRef<HTMLCanvasElement>(null)
  const drawingLayerContext = drawingLayer.current?.getContext('2d', {
    willReadFrequently: true,
  })

  useEffect(() => {
    setCanvasContexts({
      previewLayerContext,
      drawingLayerContext,
    })
  }, [previewLayerContext, drawingLayerContext, setCanvasContexts])

  function startDrawing(event: TypeEventMouseOrTouch) {
    const currentCoordinate = getCoordinate({
      blackboardRef,
      event,
    })
    setinitialCoordinate(currentCoordinate)

    if (activeTool !== 'lineWithDots' && activeTool !== 'fill') {
      setDrawing(true)
      drawingLayerContext?.beginPath()
      draw(currentCoordinate)
    }

    if (currentCoordinate && activeTool === 'lineWithDots') {
      const coordinateExists = lineWithDotsCoordinates.reduce(
        (acumulator, coordinate, i) => {
          const distanceOfPoints = Math.sqrt(
            (coordinate.x - currentCoordinate.x) ** 2 +
              (coordinate.y - currentCoordinate.y) ** 2,
          )
          console.log(distanceOfPoints)

          if (distanceOfPoints <= 10) {
            setSelectedCoordinateIndex(i)
            acumulator = true
          }
          return acumulator
        },
        false,
      )

      if (coordinateExists) {
        setIsEditingCoordinate(true)
      } else {
        setLineWithDotsCoordinates((prev) => [...prev, currentCoordinate])
      }
    }

    if (drawingLayerContext && blackboardSize && activeTool === 'fill') {
      if (currentCoordinate) {
        fill(currentCoordinate, lineColor)
      }
    }
  }

  function draw(currentCoordinate: CoordinateType | null) {
    if (drawingLayerContext && currentCoordinate) {
      if (activeTool === 'line' || activeTool === 'eraser') {
        drawingLayerContext.lineWidth = transformedLineWidth
        drawingLayerContext.lineCap = 'round'
        drawingLayerContext.lineJoin = 'round'
        drawingLayerContext.lineTo(currentCoordinate.x, currentCoordinate.y)
        if (activeTool === 'line') {
          drawLine(currentCoordinate)
        }
        if (activeTool === 'eraser') {
          erase(currentCoordinate)
        }
      }
    }

    function drawLine(currentCoordinate: CoordinateType | null) {
      if (drawingLayerContext && currentCoordinate) {
        drawingLayerContext.globalCompositeOperation = 'source-over'
        drawingLayerContext.strokeStyle = lineColor
        drawingLayerContext.stroke()
      }
    }
    function erase(currentCoordinate: CoordinateType | null) {
      if (drawingLayerContext && currentCoordinate) {
        drawingLayerContext.globalCompositeOperation = 'destination-out'
        drawingLayerContext.stroke()
      }
    }
  }

  function drawSquare(currentCoordinate: CoordinateType | null) {
    if (drawingLayerContext && initialCoordinate && currentCoordinate) {
      drawingLayerContext.rect(
        initialCoordinate.x,
        initialCoordinate.y,
        currentCoordinate.x - initialCoordinate.x,
        currentCoordinate.y - initialCoordinate.y,
      )
      drawingLayerContext.lineWidth = transformedLineWidth
      drawingLayerContext.strokeStyle = lineColor
      drawingLayerContext.fillStyle = lineColor
      drawingLayerContext.lineJoin = 'miter'
      if (fillShape.square) {
        drawingLayerContext.fill()
      } else {
        drawingLayerContext.stroke()
      }
    }
  }

  function drawCircle(currentCoordinate: CoordinateType | null) {
    if (drawingLayerContext && initialCoordinate && currentCoordinate) {
      const radius = Math.sqrt(
        (initialCoordinate.x - currentCoordinate.x) ** 2 +
          (initialCoordinate.y - currentCoordinate.y) ** 2,
      )

      drawingLayerContext.arc(
        initialCoordinate.x,
        initialCoordinate.y,
        radius,
        0,
        Math.PI * 2,
      )

      drawingLayerContext.lineWidth = transformedLineWidth
      drawingLayerContext.strokeStyle = lineColor
      drawingLayerContext.fillStyle = lineColor
      if (fillShape.circle) {
        drawingLayerContext.fill()
      } else {
        drawingLayerContext.stroke()
      }
    }
  }

  function drawStraightLine(currentCoordinate: CoordinateType | null) {
    if (drawingLayerContext && initialCoordinate && currentCoordinate) {
      drawingLayerContext.moveTo(initialCoordinate.x, initialCoordinate.y)
      drawingLayerContext.lineTo(currentCoordinate.x, currentCoordinate.y)
      drawingLayerContext.lineWidth = transformedLineWidth
      drawingLayerContext.strokeStyle = lineColor
      drawingLayerContext.lineCap = 'round'
      drawingLayerContext.stroke()
    }
  }

  function fill(currentCoordinate: CoordinateType, color: string) {
    if (!drawingLayerContext) {
      return
    }
    const imageData = drawingLayerContext.getImageData(
      0,
      0,
      drawingLayerContext.canvas.width,
      drawingLayerContext.canvas.height,
    )

    const targetColor = getPixelColor({ currentCoordinate, imageData })

    const fillColor = hexToRgba(color)

    let fillStack: FillPointType[] = []

    if (targetColor && fillColor) {
      floodFill(currentCoordinate, targetColor)
      fillColorRun()
    }

    function floodFill(
      currentCoordinate: CoordinateType,
      targetColor: ColorTypeRgba,
    ) {
      if (
        currentCoordinate.x < 0 ||
        currentCoordinate.y < 0 ||
        currentCoordinate.x === imageData.width ||
        currentCoordinate.y === imageData.height ||
        colorsMatch(targetColor, fillColor)
      ) {
        return
      }

      const currentColor = getPixelColor({ currentCoordinate, imageData })
      if (currentColor && colorsMatch(currentColor, targetColor)) {
        setPixelColor({
          currentCoordinate,
          fillColor,
          imageData,
        })

        fillStack.push(
          {
            point: newPoint(currentCoordinate.x + 1, currentCoordinate.y),
            targetColor,
            fillColor,
          },
          {
            point: newPoint(currentCoordinate.x - 1, currentCoordinate.y),
            targetColor,
            fillColor,
          },
          {
            point: newPoint(currentCoordinate.x, currentCoordinate.y + 1),
            targetColor,
            fillColor,
          },
          {
            point: newPoint(currentCoordinate.x, currentCoordinate.y - 1),
            targetColor,
            fillColor,
          },
        )
      } else {
        if (currentColor && currentColor[3] < 255) {
          setPixelColor({
            currentCoordinate,
            fillColor,
            imageData,
          })
        }
      }
    }

    function fillColorRun() {
      if (fillStack.length) {
        const range = fillStack.length
        fillStack.forEach((fillPoint) => {
          const [currentCoordinate, targetColor, fillColor] = [
            fillPoint.point,
            fillPoint.targetColor,
            fillPoint.fillColor,
          ]
          if (targetColor && fillColor) {
            floodFill(currentCoordinate, targetColor)
          }
        })
        fillStack.splice(0, range)
        fillColorRun()
      } else {
        if (drawingLayerContext) {
          drawingLayerContext.putImageData(imageData, 0, 0)
        }
        fillStack = []
      }
    }

    function newPoint(x: number, y: number) {
      return {
        x,
        y,
      }
    }
  }

  function handleMouseMove(event: TypeEventMouseOrTouch) {
    const currentCoordinate = getCoordinate({
      blackboardRef,
      event,
    })
    if (activeTool !== 'lineWithDots') {
      clearPreviewContext({ previewLayerContext })
    }
    if (previewLayerContext && blackboardSize && currentCoordinate) {
      if (activeTool === 'line' || activeTool === 'eraser') {
        previewLayerContext.strokeStyle = '#000'
        previewLayerContext.setLineDash([10, 3])
        previewLayerContext.lineWidth = 2.5
        previewLayerContext.arc(
          currentCoordinate.x,
          currentCoordinate.y,
          transformedLineWidth / 2,
          0,
          Math.PI * 2,
        )
        previewLayerContext.stroke()
        if (drawing) {
          draw(currentCoordinate)
        }
      }

      if (activeTool === 'square' && initialCoordinate && drawing) {
        previewLayerContext.strokeStyle = `${lineColor}8a`
        previewLayerContext.fillStyle = `${lineColor}8a`
        previewLayerContext.lineWidth = transformedLineWidth
        previewLayerContext.setLineDash([])
        previewLayerContext.rect(
          initialCoordinate.x,
          initialCoordinate.y,
          currentCoordinate.x - initialCoordinate.x,
          currentCoordinate.y - initialCoordinate.y,
        )
        if (fillShape.square) {
          previewLayerContext.fill()
        } else {
          previewLayerContext.stroke()
        }
      }

      if (activeTool === 'circle' && initialCoordinate && drawing) {
        previewLayerContext.strokeStyle = `${lineColor}8a`
        previewLayerContext.fillStyle = `${lineColor}8a`
        previewLayerContext.lineWidth = transformedLineWidth
        previewLayerContext.setLineDash([])
        const radius = Math.sqrt(
          (initialCoordinate.x - currentCoordinate.x) ** 2 +
            (initialCoordinate.y - currentCoordinate.y) ** 2,
        )

        previewLayerContext.arc(
          initialCoordinate.x,
          initialCoordinate.y,
          radius,
          0,
          Math.PI * 2,
        )
        if (fillShape.circle) {
          previewLayerContext.fill()
        } else {
          previewLayerContext.stroke()
        }
      }

      if (activeTool === 'straightLine' && initialCoordinate && drawing) {
        previewLayerContext.lineWidth = transformedLineWidth
        previewLayerContext.strokeStyle = `${lineColor}8a`
        previewLayerContext.lineCap = 'round'
        previewLayerContext.setLineDash([])
        previewLayerContext.moveTo(initialCoordinate.x, initialCoordinate.y)
        previewLayerContext.lineTo(currentCoordinate.x, currentCoordinate.y)
        previewLayerContext.stroke()
      }

      if (
        activeTool === 'lineWithDots' &&
        isEditingCoordinate &&
        selectedCoordinateIndex !== null
      ) {
        const newCoordinate = {
          x: currentCoordinate.x,
          y: currentCoordinate.y,
        }

        const newArray = lineWithDotsCoordinates
        newArray[selectedCoordinateIndex] = newCoordinate
        setLineWithDotsCoordinates(newArray)
        lineWithDots({ previewLayerContext, lineWithDotsCoordinates })
      }
    }
  }

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchend', handleMouseUp)
    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [initialCoordinate, lineWithDotsCoordinates]) // eslint-disable-line

  useEffect(() => {
    clearPreviewContext({ previewLayerContext })
    setLineWithDotsCoordinates([])
  }, [
    activeTool,
    previewLayerContext,
    setLineWithDotsCoordinates,
    restoreArray,
  ])

  function handleMouseUp(event: TypeEventMouseOrTouch) {
    setinitialCoordinate(null)
    setDrawing(false)
    if (initialCoordinate && activeTool !== 'lineWithDots') {
      const currentCoordinate = getCoordinate({
        blackboardRef,
        event,
      })

      if (drawingLayerContext) {
        drawingLayerContext.globalCompositeOperation = 'source-over'
      }

      if (activeTool === 'square') {
        drawSquare(currentCoordinate)
      }

      if (activeTool === 'circle') {
        drawCircle(currentCoordinate)
      }

      if (activeTool === 'straightLine') {
        drawStraightLine(currentCoordinate)
      }

      clearPreviewContext({ previewLayerContext })
      saveImageData()
    }

    if (activeTool === 'lineWithDots') {
      setIsEditingCoordinate(false)
      lineWithDots({ previewLayerContext, lineWithDotsCoordinates })
    }
  }

  function handleMouseLeave() {
    if (activeTool === 'line' || activeTool === 'eraser') {
      clearPreviewContext({ previewLayerContext })
    }
  }

  function handleMouseEnter() {
    drawingLayerContext?.beginPath()
  }

  return (
    <>
      <div
        onMouseDown={startDrawing}
        onTouchStart={startDrawing}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <canvas
          width={blackboardSize?.width}
          height={blackboardSize?.height}
          ref={drawingLayer}
        />
        <canvas
          width={blackboardSize?.width}
          height={blackboardSize?.height}
          ref={previewLayerRef}
        />
      </div>
    </>
  )
}
