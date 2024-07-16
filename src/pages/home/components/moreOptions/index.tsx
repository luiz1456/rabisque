import { useContext } from 'react'
import { ButtonsFillShape, ButtonsLineWithDots, Container } from './styles'
import { toolsbarContext } from '../../../../context/toolsbarContext'
import { CanvasContextsType } from '../..'
import { clearPreviewContext } from '../../utils/clearPreviewContext'
import { lineWithDots } from '../../utils/lineWithDots'
import {
  FaCheck,
  FaCircle,
  FaRegCircle,
  FaRegSquare,
  FaSquare,
  FaTrash,
} from 'react-icons/fa'
import { MdArrowDropDown } from 'react-icons/md'
import { FaXmark } from 'react-icons/fa6'

interface MoreOptionsProps {
  canvasContexts: CanvasContextsType | null
  saveImageData: () => void
}

export function MoreOptions({
  canvasContexts,
  saveImageData,
}: MoreOptionsProps) {
  const {
    activeTool,
    transformedLineWidth,
    lineColor,
    lineWithDotsCoordinates,
    setLineWithDotsCoordinates,
    fillShape,
    setFillShape,
  } = useContext(toolsbarContext)

  function drawLineWithDots() {
    lineWithDotsCoordinates.forEach((coordinate) => {
      if (canvasContexts && canvasContexts.drawingLayerContext) {
        canvasContexts.drawingLayerContext.lineTo(coordinate.x, coordinate.y)
        canvasContexts.drawingLayerContext.lineWidth = transformedLineWidth
        canvasContexts.drawingLayerContext.strokeStyle = lineColor
        canvasContexts.drawingLayerContext.lineJoin = 'round'
        canvasContexts.drawingLayerContext.lineCap = 'round'
        canvasContexts.drawingLayerContext.stroke()
        setLineWithDotsCoordinates([])
      }
      const previewLayerContext = canvasContexts?.previewLayerContext
      clearPreviewContext({ previewLayerContext })
    })
    saveImageData()
  }

  function deleteOneDot() {
    lineWithDotsCoordinates.pop()
    const updatedArray = lineWithDotsCoordinates
    setLineWithDotsCoordinates(updatedArray)
    const previewLayerContext = canvasContexts?.previewLayerContext
    lineWithDots({ previewLayerContext, lineWithDotsCoordinates: updatedArray })
  }

  function deleteAllDots() {
    setLineWithDotsCoordinates([])
    const previewLayerContext = canvasContexts?.previewLayerContext
    lineWithDots({ previewLayerContext, lineWithDotsCoordinates: [] })
  }

  function fillShapeToggle(value: boolean) {
    if (activeTool === 'square') {
      return {
        ...fillShape,
        square: value,
      }
    }
    if (activeTool === 'circle') {
      return {
        ...fillShape,
        circle: value,
      }
    }
    return fillShape
  }

  function getClass(isFillShape: boolean) {
    if (activeTool === 'circle' && fillShape.circle === isFillShape) {
      return 'active'
    }

    if (activeTool === 'square' && fillShape.square === isFillShape) {
      return 'active'
    }
  }

  return (
    <Container>
      <div className="logo">
        <h1>Rabisque</h1>
      </div>
      <div className="containerButtons">
        {activeTool === 'lineWithDots' && (
          <ButtonsLineWithDots>
            <button onClick={drawLineWithDots}>
              <FaCheck />
            </button>
            <button onClick={deleteOneDot}>
              <FaTrash />
            </button>
            <button onClick={deleteAllDots} className="x">
              <FaXmark />
            </button>
          </ButtonsLineWithDots>
        )}
        <ButtonsFillShape>
          {['circle', 'square'].includes(activeTool) && (
            <div>
              <button
                className={getClass(false)}
                onClick={() => setFillShape(fillShapeToggle(false))}
              >
                <MdArrowDropDown className="arrowleft" />
                {activeTool === 'circle' && <FaRegCircle />}
                {activeTool === 'square' && <FaRegSquare />}
              </button>
              <button
                className={getClass(true)}
                onClick={() => setFillShape(fillShapeToggle(true))}
              >
                <MdArrowDropDown className="arrowleft" />
                {activeTool === 'circle' && <FaCircle />}
                {activeTool === 'square' && <FaSquare />}
              </button>
            </div>
          )}
        </ButtonsFillShape>
      </div>
    </Container>
  )
}
