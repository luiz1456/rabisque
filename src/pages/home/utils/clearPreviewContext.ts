interface ClearPreviewContextProps {
  previewLayerContext: CanvasRenderingContext2D | null | undefined
}

export function clearPreviewContext({
  previewLayerContext,
}: ClearPreviewContextProps) {
  if (previewLayerContext) {
    previewLayerContext.beginPath()
    previewLayerContext.clearRect(
      0,
      0,
      previewLayerContext.canvas.width,
      previewLayerContext.canvas.height,
    )
  }
}
