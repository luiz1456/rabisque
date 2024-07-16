import { Container } from './styled'
import { Toolsbar } from './components/toolsbar'
import { Blackboard } from './components/blackboard'
import { BlackboardContainer } from './components/blackboardContainer'
import { useContext, useState } from 'react'
import { MoreOptions } from './components/moreOptions'
import { toolsbarContext } from '../../context/toolsbarContext'
import { FaFileDownload } from 'react-icons/fa'

export interface CanvasContextsType {
  previewLayerContext: CanvasRenderingContext2D | null | undefined
  drawingLayerContext: CanvasRenderingContext2D | null | undefined
}

export function Home() {
  const [canvasContexts, setCanvasContexts] =
    useState<CanvasContextsType | null>(null)
  const { setRestoreArray, backgroundColor, restoreArray } =
    useContext(toolsbarContext)

  function saveImageData() {
    if (canvasContexts?.drawingLayerContext) {
      const newImageData = canvasContexts.drawingLayerContext.getImageData(
        0,
        0,
        canvasContexts.drawingLayerContext.canvas.width,
        canvasContexts.drawingLayerContext.canvas.height,
      )
      setRestoreArray((prev) => [...prev, newImageData])
    }
  }

  const [finalImageUrl, setFinalImageUrl] = useState('')

  function getDownloadUrl() {
    if (canvasContexts?.drawingLayerContext) {
      const { width, heigth } = {
        width: canvasContexts.drawingLayerContext.canvas.width,
        heigth: canvasContexts.drawingLayerContext.canvas.height,
      }
      const finalImage = document.createElement('canvas')
      finalImage.width = width
      finalImage.height = heigth
      const finalImageContext = finalImage.getContext('2d')
      if (finalImageContext) {
        finalImageContext.fillStyle = backgroundColor
        finalImageContext.fillRect(0, 0, width, heigth)
        if (restoreArray[restoreArray.length - 1]) {
          finalImageContext.drawImage(
            canvasContexts.drawingLayerContext.canvas,
            0,
            0,
          )
        }
      }
      setFinalImageUrl(finalImage.toDataURL())
    }
  }

  return (
    <Container>
      <MoreOptions
        canvasContexts={canvasContexts}
        saveImageData={saveImageData}
      />
      <button onClick={getDownloadUrl} className="download">
        <a href={finalImageUrl} download={'meu desenho'}>
          <FaFileDownload />
        </a>
      </button>
      <BlackboardContainer>
        <Blackboard
          setCanvasContexts={setCanvasContexts}
          saveImageData={saveImageData}
        />
      </BlackboardContainer>
      <Toolsbar canvasContexts={canvasContexts} />
    </Container>
  )
}
