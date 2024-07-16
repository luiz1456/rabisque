import { CoordinateType } from '../../../context/blackboardContext'
import { clearPreviewContext } from './clearPreviewContext'

interface LineWithDotsProps {
  previewLayerContext: CanvasRenderingContext2D | null | undefined
  lineWithDotsCoordinates: CoordinateType[]
}

export function lineWithDots({
  previewLayerContext,
  lineWithDotsCoordinates,
}: LineWithDotsProps) {
  clearPreviewContext({ previewLayerContext })
  if (previewLayerContext) {
    previewLayerContext.lineWidth = 3
    lineWithDotsCoordinates.forEach((coordinate) => {
      previewLayerContext.strokeStyle = '#333333'
      previewLayerContext.setLineDash([])
      previewLayerContext.lineTo(coordinate.x, coordinate.y)
      previewLayerContext.stroke()
    })

    lineWithDotsCoordinates.forEach((coordinate) => {
      previewLayerContext.beginPath()
      previewLayerContext.arc(coordinate.x, coordinate.y, 10, 0, Math.PI * 2)
      previewLayerContext.fillStyle = '#0000ff'
      previewLayerContext.stroke()
      previewLayerContext.fill()
    })
  }
}
