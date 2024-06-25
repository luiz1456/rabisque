import {
  RefObject,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  CoordinateType,
  blackboardContext,
} from '../../../../context/blackboardContext'
import { toolsbarContext } from '../../../../context/toolsbarContext'
import { getCoordinate } from '../../utils/getCoordinates'
import { getPixelColor } from '../../utils/getPixelColor'
import hexToRgba from '../../utils/hexToRgba'
import colorsMatch from '../../utils/colorsMatch'
import { setPixelColor } from '../../utils/setPixelColor'

interface BlackboardProps {
  drawing: boolean
  setDrawing: React.Dispatch<React.SetStateAction<boolean>>
  ref: RefObject<HTMLCanvasElement>
  drawingLayerContext: CanvasRenderingContext2D | null
}

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

export const Blackboard = forwardRef<HTMLCanvasElement, BlackboardProps>(
  ({ drawing, setDrawing, drawingLayerContext }, ref) => {
    const { blackboardSize, blackboardRef } = useContext(blackboardContext)
    const { lineWidth, lineColor, activeTool, setRestoreArray } =
      useContext(toolsbarContext)
    const previewLayerRef = useRef<HTMLCanvasElement>(null)
    const previewLayerContext = previewLayerRef.current?.getContext('2d')
    const transformedLineWidth = (70 * +lineWidth) / 100 // max line width = 50
    const [lineWithDotsCoordinates, setLineWithDotsCoordinates] = useState<
      CoordinateType[]
    >([])
    const [isEditingCoordinate, setIsEditingCoordinate] =
      useState<boolean>(false)
    const [selectedCoordinateIndex, setSelectedCoordinateIndex] = useState<
      number | null
    >(null)
    const [initialCoordinate, setinitialCoordinate] =
      useState<CoordinateType | null>(null)

    const draw = (currentCoordinate: CoordinateType | null) => {
      if (drawingLayerContext && currentCoordinate) {
        if (activeTool === 'line' || activeTool === 'eraser') {
          drawingLayerContext.lineWidth = transformedLineWidth
          drawingLayerContext.lineTo(currentCoordinate.x, currentCoordinate.y)
          drawingLayerContext.lineCap = 'round'
          drawingLayerContext.lineJoin = 'round'
          if (activeTool === 'line') {
            drawLine(currentCoordinate)
          }
          if (activeTool === 'eraser') {
            dismantle(currentCoordinate)
          }
        }
      }
    }

    const drawLine = (currentCoordinate: CoordinateType | null) => {
      if (drawingLayerContext && currentCoordinate) {
        drawingLayerContext.globalCompositeOperation = 'source-over'
        drawingLayerContext.strokeStyle = lineColor
        drawingLayerContext.stroke()
      }
    }
    const dismantle = (currentCoordinate: CoordinateType | null) => {
      if (drawingLayerContext && currentCoordinate) {
        drawingLayerContext.globalCompositeOperation = 'destination-out'
        drawingLayerContext.stroke()
      }
    }
    const drawSquare = (currentCoordinate: CoordinateType | null) => {
      if (drawingLayerContext && initialCoordinate && currentCoordinate) {
        drawingLayerContext.rect(
          initialCoordinate.x,
          initialCoordinate.y,
          currentCoordinate.x - initialCoordinate.x,
          currentCoordinate.y - initialCoordinate.y,
        )
        drawingLayerContext.globalCompositeOperation = 'hard-light'
        drawingLayerContext.lineWidth = transformedLineWidth
        drawingLayerContext.strokeStyle = lineColor
        // drawingLayerContext.fillStyle = '#f00'
        // drawingLayerContext.fill()
        drawingLayerContext.stroke()
      }
    }
    const drawCircle = (currentCoordinate: CoordinateType | null) => {
      if (drawingLayerContext && initialCoordinate && currentCoordinate) {
        drawingLayerContext.arc(
          initialCoordinate.x,
          initialCoordinate.y,
          Math.sqrt(
            (initialCoordinate.x - currentCoordinate.x) ** 2 +
              (initialCoordinate.y - currentCoordinate.y) ** 2,
          ),
          0,
          Math.PI * 2,
        )
        drawingLayerContext.lineWidth = transformedLineWidth
        drawingLayerContext.strokeStyle = lineColor
        drawingLayerContext.stroke()
      }
    }
    const drawStraightLine = (currentCoordinate: CoordinateType | null) => {
      if (drawingLayerContext && initialCoordinate && currentCoordinate) {
        drawingLayerContext.moveTo(initialCoordinate.x, initialCoordinate.y)
        drawingLayerContext.lineTo(currentCoordinate.x, currentCoordinate.y)
        drawingLayerContext.lineWidth = transformedLineWidth
        drawingLayerContext.strokeStyle = lineColor
        drawingLayerContext.stroke()
      }
    }

    // function handleTouchDown(event: TypeEventMouseOrTouch) {

    //   startDrawing(currentCoordinate)
    // }
    // function handleMouseDown() {
    //   startDrawing(currentCoordinate)
    // }
    const startDrawing = (event: TypeEventMouseOrTouch) => {
      const currentCoordinate = getCoordinate({
        blackboardRef,
        event,
      })

      if (drawingLayerContext && blackboardSize && activeTool === 'fill') {
        if (currentCoordinate) {
          fill(currentCoordinate, lineColor)
        }
      }

      if (activeTool !== 'lineWithDots' && activeTool !== 'fill') {
        setinitialCoordinate(currentCoordinate)
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
        floodFill(currentCoordinate, targetColor, fillColor)
      }
      fillColorRun()

      function floodFill(
        currentCoordinate: CoordinateType,
        targetColor: ColorTypeRgba,
        fillColor: ColorTypeRgba,
      ) {
        if (colorsMatch(targetColor, fillColor)) {
          return
        }
        if (currentCoordinate.x < 0 || currentCoordinate.y < 0) {
          return
        }
        const currentColor = getPixelColor({ currentCoordinate, imageData })
        if (currentColor && colorsMatch(currentColor, targetColor)) {
          setPixelColor({
            currentCoordinate,
            fillColor,
            imageData,
          })
          fillStack.push({
            point: newPoint(currentCoordinate.x + 1, currentCoordinate.y),
            targetColor,
            fillColor,
          })
          fillStack.push({
            point: newPoint(currentCoordinate.x - 1, currentCoordinate.y),
            targetColor,
            fillColor,
          })
          fillStack.push({
            point: newPoint(currentCoordinate.x, currentCoordinate.y + 1),
            targetColor,
            fillColor,
          })
          fillStack.push({
            point: newPoint(currentCoordinate.x, currentCoordinate.y - 1),
            targetColor,
            fillColor,
          })
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
              floodFill(currentCoordinate, targetColor, fillColor)
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

      // function getPixel(point) {
      //   if (
      //     (point.x < 0 || point.y < 0 || point.x > imageData.width,
      //     point.y >= imageData.height)
      //   ) {
      //     return [-1, -1, -1, -1]
      //   } else {
      //     const offset = (point.y * imageData.width + point.x) * 4

      //     return [
      //       imageData.data[offset + 0],
      //       imageData.data[offset + 1],
      //       imageData.data[offset + 2],
      //       imageData.data[offset + 3],
      //     ]
      //   }
      // }

      // function setPixel(point, fillColor) {
      //   const offset = (point.y * imageData.width + point.x) * 4

      //   imageData.data[offset + 0] = fillColor[0]
      //   imageData.data[offset + 1] = fillColor[1]
      //   imageData.data[offset + 2] = fillColor[2]
      //   imageData.data[offset + 3] = fillColor[3]
      // }
    }

    function newPoint(x: number, y: number) {
      return {
        x,
        y,
      }
    }

    function lineWithDots() {
      clearPreviewContext()
      // previewLayerContext?.translate(0, 0)
      // previewLayerContext.translate(0.5, 0.5)
      lineWithDotsCoordinates.forEach((coordinate) => {
        if (previewLayerContext) {
          previewLayerContext.lineTo(coordinate.x, coordinate.y)
          previewLayerContext.setLineDash([])
          previewLayerContext.strokeStyle = '#333333'
          previewLayerContext.stroke()
          // if (i === lineWithDotsCoordinates.length - 1) {
          //   previewLayerContext.fill()
          // }
        }
      })

      lineWithDotsCoordinates.forEach((coordinate) => {
        if (previewLayerContext) {
          previewLayerContext.beginPath()
          previewLayerContext.arc(
            coordinate.x,
            coordinate.y,
            10,
            0,
            Math.PI * 2,
          )
          previewLayerContext.fillStyle = '#00f'
          previewLayerContext.fill()
          previewLayerContext.stroke()
        }
      })
    }

    function handleMouseMove(event: TypeEventMouseOrTouch) {
      const currentCoordinate = getCoordinate({
        blackboardRef,
        event,
      })
      if (activeTool !== 'lineWithDots') {
        clearPreviewContext()
      }
      if (previewLayerContext && blackboardSize && currentCoordinate) {
        if (activeTool === 'line' || activeTool === 'eraser') {
          previewLayerContext.beginPath()
          previewLayerContext.arc(
            currentCoordinate.x,
            currentCoordinate.y,
            transformedLineWidth / 2,
            0,
            Math.PI * 2,
          )
          if (drawing) {
            draw(currentCoordinate)
          }
        }

        if (activeTool === 'square' && initialCoordinate && drawing) {
          previewLayerContext.beginPath()
          previewLayerContext.rect(
            initialCoordinate.x,
            initialCoordinate.y,
            currentCoordinate.x - initialCoordinate.x,
            currentCoordinate.y - initialCoordinate.y,
          )
        }
        if (activeTool === 'circle' && initialCoordinate && drawing) {
          previewLayerContext.beginPath()
          previewLayerContext.arc(
            initialCoordinate.x,
            initialCoordinate.y,
            Math.sqrt(
              (initialCoordinate.x - currentCoordinate.x) ** 2 +
                (initialCoordinate.y - currentCoordinate.y) ** 2,
            ),
            0,
            Math.PI * 2,
          )
          // previewLayerContext.stroke()
        }
        if (activeTool === 'straightLine' && initialCoordinate && drawing) {
          previewLayerContext.beginPath()
          previewLayerContext.moveTo(initialCoordinate.x, initialCoordinate.y)
          previewLayerContext.lineTo(currentCoordinate.x, currentCoordinate.y)
          // previewLayerContext.stroke()
        }
        if (
          activeTool === 'lineWithDots' &&
          isEditingCoordinate &&
          selectedCoordinateIndex !== null
        ) {
          // if (distanceOfPoints <= 8) {
          // 8 é o tamanho do raio do circulo
          const newCoordinate = {
            x: currentCoordinate.x,
            y: currentCoordinate.y,
          }

          const newArray = lineWithDotsCoordinates
          newArray[selectedCoordinateIndex] = newCoordinate
          // newArray.push(newCoordinate)
          setLineWithDotsCoordinates(newArray)
          lineWithDots()
          // }
        }
        if (activeTool !== 'lineWithDots') {
          previewLayerContext.stroke()
        }
        if (['line', 'eraser', 'lineWithDots'].includes(activeTool)) {
          previewLayerContext.setLineDash([10, 3])
          previewLayerContext.lineWidth = 2.5
        } else {
          previewLayerContext.lineWidth = transformedLineWidth
          previewLayerContext.strokeStyle = `${lineColor}8a`
          previewLayerContext.setLineDash([])
        }
      }
    }

    function clearPreviewContext() {
      if (blackboardSize && previewLayerContext) {
        const { width, height } = blackboardSize
        previewLayerContext.beginPath()
        previewLayerContext.clearRect(0, 0, width, height)
      }
    }

    useEffect(() => {
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchend', handleMouseUp)
      return () => {
        window.removeEventListener('mouseup', handleMouseUp)
        window.removeEventListener('touchend', handleMouseUp)
      }
  }, [initialCoordinate]) // eslint-disable-line

    function handleMouseUp(event: TypeEventMouseOrTouch) {
      setinitialCoordinate(null)
      if (initialCoordinate && activeTool !== 'lineWithDots') {
        const currentCoordinate = getCoordinate({
          blackboardRef,
          event,
        })
        if (drawingLayerContext) {
          drawingLayerContext.globalCompositeOperation = 'source-over'
        }
        if (activeTool === 'square') {
          // clearPreviewContext()
          drawSquare(currentCoordinate)
        }
        if (activeTool === 'circle') {
          // clearPreviewContext()
          drawCircle(currentCoordinate)
          // setinitialCoordinate(null)
        }
        if (activeTool === 'straightLine') {
          // clearPreviewContext()
          drawStraightLine(currentCoordinate)
          // setinitialCoordinate(null)
        }

        clearPreviewContext()
        saveImageData()
      }
      if (activeTool === 'lineWithDots') {
        // clearPreviewContext()
        setIsEditingCoordinate(false)
        // if (!isEditingCoordinate) {
        lineWithDots()
        // }
        // setinitialCoordinate(null)
      }
    }
    function saveImageData() {
      if (drawingLayerContext && blackboardSize) {
        const { width, height } = blackboardSize
        const newImageData = drawingLayerContext.getImageData(
          0,
          0,
          width,
          height,
        )
        setRestoreArray((prev) => [...prev, newImageData])
      }
    }
    function handleMouseLeave() {
      if (activeTool === 'line' || activeTool === 'eraser') {
        clearPreviewContext()
      }
    }
    function handleMouseEnter() {
      drawingLayerContext?.beginPath()
    }

    function handleClick() {
      if (drawingLayerContext) {
        lineWithDotsCoordinates.forEach((coordinate) => {
          drawingLayerContext.lineTo(coordinate.x, coordinate.y)
          drawingLayerContext.strokeStyle = lineColor
          drawingLayerContext.fillStyle = lineColor
          drawingLayerContext.lineWidth = transformedLineWidth
          drawingLayerContext.lineJoin = 'round'
          drawingLayerContext.lineCap = 'round'
          drawingLayerContext.stroke()
          // if (i === lineWithDotsCoordinates.length - 1) {
          //   drawingLayerContext.fill()
          // }
          setLineWithDotsCoordinates([])
          clearPreviewContext()
        })
      }
      saveImageData()
    }
    console.log('reload')
    return (
      <>
        <div
          onMouseDown={startDrawing}
          onTouchStart={startDrawing}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
          // onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <canvas
            width={blackboardSize?.width}
            height={blackboardSize?.height}
            ref={ref}
          />
          <canvas
            // onTouchMove={handleTouchMove}
            width={blackboardSize?.width}
            height={blackboardSize?.height}
            ref={previewLayerRef}
          />
        </div>
        <div
          style={{
            position: 'fixed',
            zIndex: '99999',
            bottom: '15px',
            left: '50px',
            userSelect: 'none',
          }}
        >
          <button onClick={handleClick}>ok</button>
          <button
            onClick={() => {
              lineWithDotsCoordinates.pop()
              const newArray = lineWithDotsCoordinates
              setLineWithDotsCoordinates(newArray)
              lineWithDots()
            }}
          >
            apagar1
          </button>
        </div>
      </>
    )
  },
)

Blackboard.displayName = 'Blackboard'
