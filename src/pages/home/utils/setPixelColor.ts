import { CoordinateType } from '../../../context/blackboardContext'
import { ColorTypeRgba } from '../components/blackboard'

interface getPixelColorProps {
  currentCoordinate: CoordinateType | null
  imageData: ImageData | null
  fillColor: ColorTypeRgba | null
}

export function setPixelColor({
  currentCoordinate,
  fillColor,
  imageData,
}: getPixelColorProps) {
  if (!currentCoordinate || !fillColor || !imageData) return

  // const { x, y } = currentCoordinate
  // const offset = (y * imageData.width + x) * 4

  // // Fazer uma cópia dos dados de imagem
  // const newImageData = new ImageData(
  //   new Uint8ClampedArray(imageData!.data),
  //   imageData.width,
  //   imageData.height,
  // )

  // newImageData.data[offset] = fillColor[0]
  // newImageData.data[offset + 1] = fillColor[1]
  // newImageData.data[offset + 2] = fillColor[2]
  // newImageData.data[offset + 3] = fillColor[3]
  const offset =
    (currentCoordinate.y * imageData.width + currentCoordinate.x) * 4

  imageData.data[offset + 0] = fillColor[0]
  imageData.data[offset + 1] = fillColor[1]
  imageData.data[offset + 2] = fillColor[2]
  imageData.data[offset + 3] = fillColor[3]
}
